import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import { Llm } from './llm';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],

  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(public llm: Llm) {
    llm.init();
  }

  ngOnInit() {}
}
