import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvN5KAazBe3zuJ1KM0KyEFol-7Ewajafo",
  authDomain: "my-tree-95fe9.firebaseapp.com",
  projectId: "my-tree-95fe9",
  storageBucket: "my-tree-95fe9.firebasestorage.app",
  messagingSenderId: "124969133199",
  appId: "1:124969133199:web:9f7d53fe671a1900e0fcfa",
  measurementId: "G-G595QKL374"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: 'FIRESTORE_DB', useValue: db }
  ]
};
