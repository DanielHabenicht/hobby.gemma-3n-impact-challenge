import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { NgForOf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Llm } from '../llm';

@Component({
  selector: 'app-main',
  imports: [
    MatListModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  public form;
  public preview = '';

  constructor(private fb: FormBuilder, public llm: Llm) {
    this.form = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          title: [''],
        }),
      ]),
    });
  }

  // public ngOnInit() {
  //   this.llm.getCompletion('Who are you?').subscribe({
  //     next: (response) => {
  //       console.log(response);
  //     },
  //     error: (error) => {
  //       console.error('Error generating response:', error);
  //     },
  //   });
  // }

  get items() {
    return this.form.controls['items'] as FormArray;
  }

  addItem() {
    const lessonForm = this.fb.group({
      title: [''],
    });

    this.items.push(lessonForm);
  }

  runPreview() {
    this.preview = '';
    let prompt = `Given the following list try to predict the next 3 items that will be added to the list.
Return them in the special format ["<Item>", “<Item>”] without any extra text.

`;

    this.items.value.forEach((item: any) => {
      prompt += `\n- ${item.title}`;
    });
    console.log('Prompt:', prompt);
    this.llm.getCompletion(prompt).subscribe({
      next: (response) => {
        this.preview += response;
      },
      error: (error) => {
        console.error('Error generating response:', error);
      },
    });
  }

  deleteLesson(lessonIndex: number) {
    this.items.removeAt(lessonIndex);
  }
}
