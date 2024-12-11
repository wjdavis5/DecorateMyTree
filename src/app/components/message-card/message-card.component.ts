import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface DialogData {
  message?: string;
  decoratorName?: string;
  readonly?: boolean;
}

@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.readonly ? 'Holiday Message' : 'Write a Holiday Message' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="message-field">
        <mat-label>{{ data?.readonly ? 'Message' : 'Your Message' }}</mat-label>
        <textarea
          matInput
          [(ngModel)]="message"
          [placeholder]="data?.readonly ? '' : 'Write your holiday wishes...'"
          [readonly]="data?.readonly"
          rows="4">
        </textarea>
        <mat-hint *ngIf="!data?.readonly">Your message will be attached to the ornament</mat-hint>
        <mat-hint *ngIf="data?.readonly && data?.decoratorName">
          From: {{ data.decoratorName }}
        </mat-hint>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data?.readonly ? 'Close' : 'Cancel' }}
      </button>
      <button
        *ngIf="!data?.readonly"
        mat-raised-button
        color="primary"
        [disabled]="!message.trim()"
        (click)="onConfirm()">
        Add Message
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
    }

    h2 {
      margin: 0;
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .message-field {
      width: 100%;
    }

    mat-dialog-content {
      min-width: 300px;
      padding: 20px;
    }

    ::ng-deep {
      .mat-mdc-dialog-actions {
        padding: 16px !important;
        margin: 0 !important;
        background-color: #f5f5f5;
        border-top: 1px solid #e0e0e0;
        display: flex !important;
        justify-content: flex-end !important;
        gap: 8px !important;
      }

      .mdc-button {
        min-width: 100px !important;
        height: 36px !important;
      }

      .mat-mdc-raised-button {
        background-color: #1976d2 !important;
        color: white !important;
      }

      button[mat-button] {
        background-color: #f44336 !important;
        color: white !important;
      }
    }
  `]
})
export class MessageCardComponent {
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<MessageCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data?.message) {
      this.message = data.message;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.message.trim());
  }
}
