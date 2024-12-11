import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import {
  provideAppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
const firebaseConfig = {
  apiKey: 'AIzaSyCvN5KAazBe3zuJ1KM0KyEFol-7Ewajafo',
  authDomain: 'my-tree-95fe9.firebaseapp.com',
  projectId: 'my-tree-95fe9',
  storageBucket: 'my-tree-95fe9.firebasestorage.app',
  messagingSenderId: '124969133199',
  appId: '1:124969133199:web:9f7d53fe671a1900e0fcfa',
  measurementId: 'G-G595QKL374',
  reCaptchaSiteKey: '6Lf9w5gqAAAAAP7vHBbplPmlIfU0rBQ2K1Dv4azp',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider(firebaseConfig.reCaptchaSiteKey),
      })
    ),
    provideAuth(() => {
      const auth = getAuth();
      if (isDevMode()) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (isDevMode()) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
  ],
};
