import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response';

@Injectable({
  providedIn: 'root'
})
export class Login {

    login(email: string, password: string): Promise<LoginResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token : 'wawatoken' });
      }, 1000);
    });
  }
  
}
