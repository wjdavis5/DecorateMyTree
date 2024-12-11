import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface MessageData {
  message: string;
  decoratorName: string;
}

@Component({
  selector: 'app-ornament-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="message-card">
      <mat-card-header>
        <mat-card-title>Message from {{ data.decoratorName }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="message">{{ data.message }}</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-button (click)="close()">Close</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .message-card {
      max-width: 400px;
      margin: 16px;
      background-color: #424242;
      color: white;
    }

    .message {
      white-space: pre-wrap;
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.87);
    }

    mat-card-title {
      color: white;
    }

    ::ng-deep .mat-mdc-card-header-text {
      color: white;
    }

    button {
      color: #69f0ae;
    }
  `]
})
export class OrnamentMessageComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MessageData,
    private dialogRef: MatDialogRef<OrnamentMessageComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
