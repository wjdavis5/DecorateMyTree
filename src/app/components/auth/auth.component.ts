import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { AppCheck } from '@angular/fire/app-check';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Sign In to Holiday Tree</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Email Sign In">
              <div class="tab-content">
                <mat-form-field appearance="fill">
                  <mat-label>Email</mat-label>
                  <input matInput [(ngModel)]="email" type="email" placeholder="Enter your email">
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="sendEmailLink()" [disabled]="!email">
                  Send Sign In Link
                </button>
              </div>
            </mat-tab>
            <mat-tab label="Phone Sign In">
              <div class="tab-content">
                <mat-form-field appearance="fill">
                  <mat-label>Phone Number</mat-label>
                  <input matInput [(ngModel)]="phoneNumber" type="tel" placeholder="+1234567890">
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="startPhoneSignIn()" [disabled]="!phoneNumber">
                  Send Code
                </button>
                <mat-form-field *ngIf="verificationId" appearance="fill">
                  <mat-label>Verification Code</mat-label>
                  <input matInput [(ngModel)]="verificationCode" type="text" placeholder="Enter code">
                </mat-form-field>
                <button *ngIf="verificationId" mat-raised-button color="primary" (click)="verifyCode()" [disabled]="!verificationCode">
                  Verify Code
                </button>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #1a1a1a;
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
      background-color: white;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    .tab-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    #recaptcha-container {
      margin: 10px 0;
    }

    mat-card-title {
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }
  `]
})
export class AuthComponent implements OnInit {
  email: string = '';
  phoneNumber: string = '';
  verificationId: string = '';
  verificationCode: string = '';

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private appCheck: AppCheck
  ) {}

  ngOnInit() {
    if (this.authService.isEmailSignInLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        this.handleEmailSignInLink();
      } else {
        this.snackBar.open('Please enter your email again to complete sign-in', 'Close', {
          duration: 5000
        });
      }
    }
  }

  private async handleEmailSignInLink() {
    try {
      await this.authService.handleEmailSignInLink(window.location.href);
      this.snackBar.open('Successfully signed in!', 'Close', {
        duration: 3000
      });
    } catch (error) {
      this.snackBar.open('Error signing in. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }

  async startPhoneSignIn() {
    try {
      this.verificationId = await this.authService.startPhoneSignIn(this.phoneNumber);
      this.snackBar.open('Verification code sent!', 'Close', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error starting phone sign-in:', error);
      this.snackBar.open('Error sending verification code. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }

  async verifyCode() {
    try {
      await this.authService.signInWithPhone(this.verificationId, this.verificationCode);
      this.snackBar.open('Successfully signed in!', 'Close', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error verifying code:', error);
      this.snackBar.open('Invalid verification code. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }

  async sendEmailLink() {
    try {
      await this.authService.sendSignInLink(this.email);
      this.snackBar.open('Check your email for the sign-in link!', 'Close', {
        duration: 5000
      });
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      this.snackBar.open('Error sending sign-in link. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }
}
