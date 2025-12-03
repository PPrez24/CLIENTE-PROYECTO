import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FirebaseAuthService } from '../../shared/services/firebase-auth';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private firebaseAuth: FirebaseAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailPrefix: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9._%+-]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    try {
      const { emailPrefix, password } = this.loginForm.value;
      const email = `${emailPrefix.trim()}@iteso.mx`;
      
      await this.firebaseAuth.signIn(email, password);
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

  get emailPrefix() {
    return this.loginForm.get('emailPrefix');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
