import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Token } from '../../shared/services/token';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  private tokenSvc = inject(Token);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.tokenSvc.hasToken();
  }

  logout() {
    this.tokenSvc.clearToken();
    this.router.navigateByUrl('/auth/login');
  }
}
