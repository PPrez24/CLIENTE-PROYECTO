import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Login as LoginService } from '../../shared/services/login';
import { Token } from '../../shared/services/token';
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
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private loginService: LoginService,
    private tokenService: Token,
    private router: Router
  ) {}

  login() {
    // mock login
    this.loginService.login(this.email, this.password).then((response) => {
      this.tokenService.setToken(response.token);
      this.router.navigateByUrl('/app/dashboard');
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
