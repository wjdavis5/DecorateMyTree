import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>share</mat-icon>
      Share Your Tree
    </h2>
    <mat-dialog-content>
      <p class="description">Share this link with friends and family to let them decorate your tree:</p>
      <mat-form-field appearance="fill" class="url-field">
        <mat-label>Tree URL</mat-label>
        <input matInput [value]="data.url" readonly #urlInput>
        <button mat-icon-button matSuffix (click)="copyUrl(urlInput)" matTooltip="Copy link">
          <mat-icon>content_copy</mat-icon>
        </button>
      </mat-form-field>

      <div class="share-buttons">
        <p class="share-label">Share via:</p>
        <div class="button-row">
          <button mat-raised-button class="social-button email" (click)="shareViaEmail()">
            <mat-icon>email</mat-icon>
            Email
          </button>
          <button mat-raised-button class="social-button twitter" (click)="shareViaTwitter()">
            <mat-icon>chat</mat-icon>
            Twitter
          </button>
          <button mat-raised-button class="social-button facebook" (click)="shareViaFacebook()">
            <mat-icon>thumb_up</mat-icon>
            Facebook
          </button>
          <button mat-raised-button class="social-button whatsapp" (click)="shareViaWhatsApp()">
            <mat-icon>message</mat-icon>
            WhatsApp
          </button>
        </div>
      </div>
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
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
      font-weight: 400;
    }

    h2 mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .description {
      margin: 0 0 16px;
      color: rgba(0, 0, 0, 0.7);
      text-align: center;
    }

    .url-field {
      width: 100%;
    }

    mat-dialog-content {
      min-width: 400px;
      padding: 20px;
    }

    .share-buttons {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .share-label {
      margin: 0 0 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.7);
      text-align: center;
    }

    .button-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .social-button {
      display: flex !important;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px !important;
      color: white !important;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .social-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    }

    .social-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .email {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }

    .twitter {
      background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%) !important;
    }

    .facebook {
      background: linear-gradient(135deg, #1877f2 0%, #0c63d4 100%) !important;
    }

    .whatsapp {
      background: linear-gradient(135deg, #25d366 0%, #1da851 100%) !important;
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

  shareViaEmail() {
    const subject = encodeURIComponent('Check out my Holiday Tree!');
    const body = encodeURIComponent(`I've created a holiday tree that you can decorate! Click here to add your ornaments: ${this.data.url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }

  shareViaTwitter() {
    const text = encodeURIComponent('Check out my Holiday Tree! Come decorate it with me 🎄✨');
    const url = encodeURIComponent(this.data.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
  }

  shareViaFacebook() {
    const url = encodeURIComponent(this.data.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
  }

  shareViaWhatsApp() {
    const text = encodeURIComponent(`Check out my Holiday Tree! Come decorate it with me 🎄✨ ${this.data.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  close(): void {
    this.dialogRef.close();
  }
}
