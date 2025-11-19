import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { HighlightDirective } from '../../shared/directives/highlight';
import { Login as LoginService } from '../../shared/services/login';
import { Token } from '../../shared/services/token';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer, HighlightDirective],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private loginService: LoginService,
    private tokenService: Token,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;

    this.loginService.login(this.email, this.password)
      .then(response => {
        this.tokenService.setToken(response.token);
        this.router.navigateByUrl('/app/dashboard');
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
