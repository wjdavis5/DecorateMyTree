import { Component } from '@angular/core';
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
import { RecaptchaVerifier, Auth } from '@angular/fire/auth';

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
      <mat-card>
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
                <div id="recaptcha-container"></div>
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
      background-color: #f5f5f5;
    }

    mat-card {
      max-width: 400px;
      width: 100%;
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
  `]
})
export class AuthComponent {
  email: string = '';
  phoneNumber: string = '';
  verificationId: string = '';
  verificationCode: string = '';
  private recaptchaVerifier?: RecaptchaVerifier;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.setupRecaptcha();
  }

  private setupRecaptcha() {
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  }

  async sendEmailLink() {
    try {
      await this.authService.sendSignInLink(this.email);
      this.snackBar.open('Check your email for the sign-in link!', 'Close', {
        duration: 5000
      });
    } catch (error) {
      this.snackBar.open('Error sending sign-in link. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }

  async startPhoneSignIn() {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }
      const provider = new PhoneAuthProvider(this.auth);
      this.verificationId = await provider.verifyPhoneNumber(
        this.phoneNumber,
        this.recaptchaVerifier
      );
      this.snackBar.open('Verification code sent!', 'Close', {
        duration: 3000
      });
    } catch (error) {
      this.snackBar.open('Error sending verification code. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }

  async verifyCode() {
    try {
      await this.authService.signInWithPhone(this.verificationId, this.verificationCode);
      this.router.navigate(['/']);
    } catch (error) {
      this.snackBar.open('Invalid verification code. Please try again.', 'Close', {
        duration: 5000
      });
    }
  }
}
