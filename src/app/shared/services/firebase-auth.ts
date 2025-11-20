import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Token } from './token';
import { firebaseConfig } from '../config/firebase.config';
import { getFirebaseAuth } from './firebase-client-init';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private platformId: Object;
  private auth: any = null;
  private firebaseAuthMod: any = null;
  private initialized = false;

  public authState$ = new BehaviorSubject<any | null>(null);

  constructor(@Inject(PLATFORM_ID) platformId: Object, private token: Token) {
    this.platformId = platformId;
    if (isPlatformBrowser(this.platformId)) {
      this.init().catch(console.error);
    }
  }

  private async init() {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;
    const res = await getFirebaseAuth(this.platformId);
    if (!res) return;
    this.auth = res.auth;
    this.firebaseAuthMod = res.firebaseAuthMod;

    this.firebaseAuthMod.onAuthStateChanged(this.auth, async (user: any) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          this.token.setToken(idToken);
        } catch (e) {
        }
        this.authState$.next(user);
      } else {
        this.authState$.next(null);
      }
    });

    this.initialized = true;
  }

  async signIn(email: string, password: string) {
    if (!isPlatformBrowser(this.platformId)) throw new Error('Not available on server');
    await this.init();
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const idToken = await cred.user.getIdToken();
    this.token.setToken(idToken);

    this.authState$.next(cred.user);
    return cred.user;
  }

  async signUp(email: string, password: string) {
    if (!isPlatformBrowser(this.platformId)) throw new Error('Not available on server');
    await this.init();
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const idToken = await cred.user.getIdToken();
    this.token.setToken(idToken);

    this.authState$.next(cred.user);
    return cred.user;
  }

  async signOut() {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.init();
    const { signOut } = await import('firebase/auth');
    await signOut(this.auth);
    this.token.clearToken();

    this.authState$.next(null);
  }

  async getIdToken(): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) return null;
    await this.init();
    if (this.auth && this.auth.currentUser) {
      return await this.auth.currentUser.getIdToken();
    }
    return null;
  }
}
