import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private static readonly ADMIN_EMAILS = [
    'admin@iteso.mx'
  ];

  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin$.asObservable();

  constructor(private firebaseAuth: FirebaseAuthService) {
    this.firebaseAuth.authState$.subscribe(user => {
      if (!user || !user.email) {
        this._isAdmin$.next(false);
        return;
      }
      const email = (user.email as string).toLowerCase();
      const isAdmin = RolesService.ADMIN_EMAILS.includes(email);
      this._isAdmin$.next(isAdmin);
    });
  }

  isAdminSync(): boolean {
    return this._isAdmin$.value;
  }
}
