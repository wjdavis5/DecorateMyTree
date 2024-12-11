import { Injectable } from '@angular/core';
import {
  Auth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  onAuthStateChanged,
  User,
  ApplicationVerifier,
  ConfirmationResult,
  updateProfile
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppCheck, getToken } from '@angular/fire/app-check';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router,
    private appCheck: AppCheck
  ) {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });

    // Check for email sign-in links on startup
    if (this.isEmailSignInLink(window.location.href)) {
      this.handleEmailSignInLink(window.location.href);
    }
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Email Link Authentication
  async sendSignInLink(email: string): Promise<void> {
    const actionCodeSettings = {
      url: window.location.origin + '/auth',
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.example.holidaytree'
      },
      android: {
        packageName: 'com.example.holidaytree',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'holidaytree.page.link'
    };

    try {
      console.log('Sending sign in link to:', email);
      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
      // Store email for later use
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Error sending sign in link:', error);
      throw error;
    }
  }

  isEmailSignInLink(url: string): boolean {
    return isSignInWithEmailLink(this.auth, url);
  }

  async handleEmailSignInLink(url: string): Promise<void> {
    try {
      const email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        throw new Error('Email not found in storage');
      }

      const result = await signInWithEmailLink(this.auth, email, url);
      window.localStorage.removeItem('emailForSignIn');

      // Set display name if not set
      if (!result.user.displayName) {
        await updateProfile(result.user, {
          displayName: email.split('@')[0] // Use part before @ as display name
        });
      }

      this.onLoginSuccess();
    } catch (error) {
      console.error('Error signing in with email link:', error);
      throw error;
    }
  }

  // Phone Authentication
  async signInWithPhone(verificationId: string, verificationCode: string): Promise<void> {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const result = await signInWithCredential(this.auth, credential);

      // Set display name if not set
      if (!result.user.displayName) {
        await updateProfile(result.user, {
          displayName: `User${result.user.uid.slice(0, 6)}` // Use part of UID as display name
        });
      }

      this.onLoginSuccess();
    } catch (error) {
      console.error('Error signing in with phone:', error);
      throw error;
    }
  }

  async startPhoneSignIn(phoneNumber: string): Promise<string> {
    try {
      // Get the App Check token
      const appCheckTokenResponse = await getToken(this.appCheck);

      // Create an ApplicationVerifier that uses the App Check token
      const appCheckVerifier: ApplicationVerifier = {
        type: 'recaptcha',
        verify: async () => appCheckTokenResponse.token
      };

      // Start phone verification
      const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(
        this.auth,
        phoneNumber,
        appCheckVerifier
      );

      return confirmationResult.verificationId;
    } catch (error) {
      console.error('Error starting phone sign-in:', error);
      throw error;
    }
  }

  // Helper method for post-login navigation
  private async onLoginSuccess(): Promise<void> {
    const postLoginAction = localStorage.getItem('postLoginAction');
    localStorage.removeItem('postLoginAction');

    if (postLoginAction === 'createTree') {
      await this.router.navigate(['/create']);
    } else {
      await this.router.navigate(['/home']);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/auth']);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
