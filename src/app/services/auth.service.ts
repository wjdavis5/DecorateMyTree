import { Injectable } from '@angular/core';
import { Auth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async sendSignInLink(email: string): Promise<void> {
    const actionCodeSettings = {
      url: window.location.origin + '/auth/email-signin',
      handleCodeInApp: true
    };

    await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
    // Save email for later use
    localStorage.setItem('emailForSignIn', email);
  }

  async completeEmailSignIn(email: string, link: string): Promise<User> {
    try {
      const result = await signInWithEmailLink(this.auth, email, link);
      localStorage.removeItem('emailForSignIn');
      return result.user;
    } catch (error) {
      console.error('Error completing email sign in:', error);
      throw error;
    }
  }

  async signInWithPhone(verificationId: string, code: string): Promise<User> {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(this.auth, credential);
      return result.user;
    } catch (error) {
      console.error('Error signing in with phone:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
