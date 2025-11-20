import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { HighlightDirective } from '../../shared/directives/highlight';
import { FirebaseAuthService } from '../../shared/services/firebase-auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer, HighlightDirective],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  emailPrefix = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private firebaseAuth: FirebaseAuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async register(form: NgForm) {
    if (form.invalid) return;
    
    // Construct full email from prefix
    const email = `${this.emailPrefix.trim()}@iteso.mx`;

    this.loading = true;
    try {
      // FirebaseAuthService handles token storage and server session sync
      const user = await this.firebaseAuth.signUp(email, this.password);
      // mark welcome pending for this uid so Dashboard can show one-time message
      try {
        localStorage.setItem(`welcome_pending_${user.uid}`, '1');
      } catch (e) {
        // ignore storage errors
      }
      this.router.navigateByUrl('/app/dashboard');
    } catch (err: any) {
      console.error('Register error', err);
      this.error = err?.message || 'Error al crear la cuenta';
    } finally {
      this.loading = false;
    }
  }
}
