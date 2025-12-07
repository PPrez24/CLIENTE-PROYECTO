import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

let cachedAuth: any = null;
let cachedFirebaseAuthMod: any = null;

export async function getFirebaseAuth(platformId: Object) {
  if (!isPlatformBrowser(platformId)) return null;

  if (cachedAuth && cachedFirebaseAuthMod) {
    return {
      auth: cachedAuth,
      firebaseAuthMod: cachedFirebaseAuthMod
    };
  }

  const firebaseAppMod = await import('firebase/app');
  const firebaseAuthMod = await import('firebase/auth');

  const { initializeApp, getApps, getApp } = firebaseAppMod as any;

  let app: any;
  const apps = getApps();
  if (!apps || apps.length === 0) {
    app = initializeApp(environment.firebase);
  } else {
    app = getApp();
  }

  const auth = (firebaseAuthMod as any).getAuth(app);

  cachedAuth = auth;
  cachedFirebaseAuthMod = firebaseAuthMod;

  return { auth, firebaseAuthMod };
}
