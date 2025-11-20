import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Token {
  private platformId: Object;
  private tokenKey = 'token';
  public token$ = new BehaviorSubject<string>('');

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
    if (isPlatformBrowser(this.platformId)) {
      const t = localStorage.getItem(this.tokenKey) || '';
      this.token$.next(t);
    }
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      this.token$.next(token);
    }
  }
  
  getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey) || '';
    }
    return '';
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.token$.next('');
    }
  }
}
