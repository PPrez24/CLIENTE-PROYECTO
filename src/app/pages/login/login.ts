import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FirebaseAuthService } from '../../shared/services/firebase-auth';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  emailPrefix = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private firebaseAuth: FirebaseAuthService,
    private router: Router
  ) {}

  async login() {
    this.loading = true;
    this.error = '';
    try {
      // Construct full email from prefix
      const email = `${this.emailPrefix.trim()}@iteso.mx`;
      
      // FirebaseAuthService handles token storage
      await this.firebaseAuth.signIn(email, this.password);
      this.router.navigateByUrl('/app/dashboard');
    } catch (err: any) {
      console.error('Login error', err);
      this.error = err?.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
