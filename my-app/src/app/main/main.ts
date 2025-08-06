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

@Component({
  selector: 'app-main',
  imports: [MatListModule, MatIconModule, MatInputModule, FormsModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  public form

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      items: this.fb.array([this.fb.group({
        title: [''],
      })])
    });
  }



  get items() {
    return this.form.controls["items"] as FormArray;
  }

  addItem() {
    const lessonForm = this.fb.group({
      title: [''],
    });

    this.items.push(lessonForm);
  }

  deleteLesson(lessonIndex: number) {
    this.items.removeAt(lessonIndex);
  }
}
