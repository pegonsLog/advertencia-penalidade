import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyB_AWeLprx4rAcGjfcALNyedvo1GhQEJ7w",
        authDomain: "notificacao-advertencia.firebaseapp.com",
        projectId: "notificacao-advertencia",
        storageBucket: "notificacao-advertencia.firebasestorage.app",
        messagingSenderId: "362166436954",
        appId: "1:362166436954:web:00f60fdacdbb71cab84463"
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
