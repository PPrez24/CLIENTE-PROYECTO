import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';

import { Token } from '../../shared/services/token';
import { FirebaseAuthService } from '../../shared/services/firebase-auth';
import { AuthVisibleDirective } from '../../shared/directives/auth-visible';
import { RolesService } from '../../shared/services/roles.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthVisibleDirective],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
  private tokenSvc = inject(Token);
  private router = inject(Router);
  private firebaseAuth = inject(FirebaseAuthService);
  private roles = inject(RolesService);

  currentUrl: string = '';
  isAdmin$ = this.roles.isAdmin$;

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.tokenSvc.hasToken();
  }

  get isAuthPage(): boolean {
    return this.currentUrl.includes('/auth/login') || this.currentUrl.includes('/auth/register');
  }

  get isHome(): boolean {
    return this.currentUrl === '/' || this.currentUrl === '';
  }

  logout() {
    this.firebaseAuth.signOut()
      .then(() => {
        this.router.navigateByUrl('/auth/login');
      })
      .catch(() => {
        this.tokenSvc.clearToken();
        this.router.navigateByUrl('/auth/login');
      });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
