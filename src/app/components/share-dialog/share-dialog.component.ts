import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface DialogData {
  url: string;
}

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Share Your Tree</h2>
    <mat-dialog-content>
      <p>Share this link with friends and family to let them decorate your tree:</p>
      <mat-form-field appearance="fill" class="url-field">
        <mat-label>Tree URL</mat-label>
        <input matInput [value]="data.url" readonly #urlInput>
        <button mat-icon-button matSuffix (click)="copyUrl(urlInput)">
          <mat-icon>content_copy</mat-icon>
        </button>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
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

    p {
      margin: 0 0 16px;
      color: rgba(0, 0, 0, 0.87);
    }

    .url-field {
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
      }

      .mdc-button {
        min-width: 100px !important;
        height: 36px !important;
      }
    }
  `]
})
export class ShareDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar
  ) {}

  copyUrl(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
    this.snackBar.open('URL copied to clipboard!', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
