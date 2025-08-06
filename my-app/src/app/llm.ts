import { Injectable } from '@angular/core';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import {
  ConnectableObservable,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Llm {
  private llmInference: Observable<LlmInference> | null = null;

  private fileSetResolver(): Observable<LlmInference> {
    if (this.llmInference != null) {
      return this.llmInference;
    }
    const observable = new Observable<LlmInference>((observer) => {
      FilesetResolver.forGenAiTasks('/wasm').then((genai) => {
        console.log('loaded');
        LlmInference.createFromOptions(genai, {
          baseOptions: {
            modelAssetPath: '/assets/gemma3-4b-it-int4.task',
            // modelAssetPath: '/assets/gemma3-1b-it-int4.task',
            // modelAssetPath: '/assets/gemma-3n-E2B-it-int4.task',
          },
          maxTokens: 1000,
          topK: 40,
          temperature: 0.8,
          randomSeed: 101,
        })
          .then((llmInference) => {
            console.log('init');
            observer.next(llmInference);
            observer.complete();
          })
          .catch((error) => {
            console.error('Error initializing LLM Inference:', error);
            observer.error(error);
          });
      });
    }).pipe(shareReplay());
    // (observable as ConnectableObservable<LlmInference>).connect();
    this.llmInference = observable;
    return observable;
  }

  getCompletion(prompt: string): Observable<string> {
    return this.fileSetResolver().pipe(
      switchMap((llmInference) => this.generateResponse(prompt, llmInference))
    );
  }

  public init() {
    this.fileSetResolver().subscribe({});
  }

  private generateResponse(
    prompt: string,
    llmInference: LlmInference
  ): Observable<string> {
    // https://ai.google.dev/gemma/docs/core/prompt-structure
    prompt = `<start_of_turn>user\n${prompt}<end_of_turn>\n<start_of_turn>model`;
    console.log('Generating response for prompt:', prompt);
    return new Observable((observer) => {
      llmInference
        .generateResponse(prompt, (partialResult, done) => {
          if (done) {
            observer.next(partialResult);
            observer.complete();
          } else {
            observer.next(partialResult);
          }
        })
        .catch((error) => {
          console.error('Error generating response:', error);
          observer.error(error);
        });
    });
  }
}
