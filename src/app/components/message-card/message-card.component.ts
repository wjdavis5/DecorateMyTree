import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <mat-card class="message-card">
      <mat-card-header>
        <mat-card-title>Add a Message</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="messageForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Your Name</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Your Message</mat-label>
            <textarea matInput formControlName="message" required rows="3"></textarea>
          </mat-form-field>
          <div class="actions">
            <button mat-button type="button" (click)="onCancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!messageForm.valid">
              Add Message
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .message-card {
      max-width: 400px;
      margin: 16px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    textarea {
      resize: none;
    }
  `]
})
export class MessageCardComponent {
  @Output() submit = new EventEmitter<{name: string; message: string}>();
  @Output() cancel = new EventEmitter<void>();

  messageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      name: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.messageForm.valid) {
      this.submit.emit(this.messageForm.value);
      this.messageForm.reset();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.messageForm.reset();
  }
}
