import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firebaseConfig } from '../config/firebase.config';

export async function getFirebaseAuth(platformId: Object) {
  if (!isPlatformBrowser(platformId)) return null;

  const firebaseApp = await import('firebase/app');
  const firebaseAuthMod = await import('firebase/auth');

  const apps = (firebaseApp as any).getApps();
  let app: any;
  if (!apps || apps.length === 0) {
    app = (firebaseApp as any).initializeApp(firebaseConfig);
  } else {
    app = (firebaseApp as any).getApp();
  }

  const auth = (firebaseAuthMod as any).getAuth(app);
  return { auth, firebaseAuthMod };
}
