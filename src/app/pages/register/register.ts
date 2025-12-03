import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { HighlightDirective } from '../../shared/directives/highlight';
import { FirebaseAuthService } from '../../shared/services/firebase-auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Header, Footer, HighlightDirective],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private firebaseAuth: FirebaseAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      emailPrefix: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9._%+-]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { emailPrefix, password } = this.registerForm.value;
    const email = `${emailPrefix.trim()}@iteso.mx`;

    this.loading = true;
    try {
      const user = await this.firebaseAuth.signUp(email, password);
      try {
        localStorage.setItem(`welcome_pending_${user.uid}`, '1');
      } catch (e) {
      }
      this.router.navigateByUrl('/app/dashboard');
    } catch (err: any) {
      console.error('Register error', err);
      this.error = err?.message || 'Error al crear la cuenta';
    } finally {
      this.loading = false;
    }
  }

  get emailPrefix() {
    return this.registerForm.get('emailPrefix');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get passwordMismatch() {
    return this.registerForm.hasError('passwordMismatch') && 
           this.confirmPassword?.touched;
  }
}
