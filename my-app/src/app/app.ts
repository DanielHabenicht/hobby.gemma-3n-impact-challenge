import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],

  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  ngOnInit() {
    FilesetResolver.forGenAiTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm"
    ).then((genai) => {
        console.log("loaded");
      LlmInference.createFromOptions(genai, {
        baseOptions: {
          modelAssetPath: '/assets/gemma-2b-it-gpu-int8.bin'
        },
        maxTokens: 1000,
        topK: 40,
        temperature: 0.8,
        randomSeed: 101
      }).then(
        
        (llmInference) => {
          console.log("init");
          llmInference.generateResponse("Hi who are you?").then(
            (response) => {
              console.log(response);

            }
          );

        }
      );

      


    });

    // llmInference.generateResponse(
    //   inputPrompt,
    //   (partialResult, done) => {
    //         document.getElementById('output').textContent += partialResult;
    // });
  }
}
