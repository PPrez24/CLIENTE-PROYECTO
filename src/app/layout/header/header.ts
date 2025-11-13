import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Token } from '../../shared/services/token';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  constructor(private token: Token, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.token.hasToken();
  }

  get isAuthPage(): boolean {
    return this.router.url === '/auth/login' || this.router.url === '/auth/register';
  }

  logout(): void {
    this.token.setToken('');
    window.location.reload(); // Para recargar y ocultar los links
  }
}
