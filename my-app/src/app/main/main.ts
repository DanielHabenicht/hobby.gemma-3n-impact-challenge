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
          title: ['Clean the house'],
        }),
      ]),
    });
  }

  public ngOnInit() {
    // this.preview = '';
    // this.llm.getCompletion('Who are you?').subscribe({
    //   next: (response) => {
    //     this.preview += response;
    //   },
    //   error: (error) => {
    //     console.error('Error generating response:', error);
    //   },
    // });
  }

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
    let list = this.items.value
      .filter((item: any) => item.title && item.title.trim() !== '')
      .map((item: any) => ' - ' + item.title)
      .join('\n');
    let prompt =
      `You were given the following list: \n` +
      list +
      `\n\n Think of 3 items that should also be put onto the list.

Only return the items as a JSON array without any extra markup.`;

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
