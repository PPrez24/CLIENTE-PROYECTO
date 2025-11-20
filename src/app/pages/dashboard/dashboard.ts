import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ActivitiesService, Activity } from '../../shared/services/activities';
import { FirebaseAuthService } from '../../shared/services/firebase-auth';

// one-time welcome banner key prefix
const WELCOME_KEY_PREFIX = 'welcome_pending_';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  items: Activity[] = [];

  showWelcome = false;
  userName: string = '';
  isFirstLogin: boolean = false;

  constructor(private svc: ActivitiesService, private firebaseAuth: FirebaseAuthService) {}

  ngOnInit() {
    this.items = this.svc.list();

    // check for pending welcome once auth state is available
    this.firebaseAuth.authState$.subscribe(user => {
      if (user && user.uid) {
        // Extract user name from displayName or email
        if (user.displayName) {
          this.userName = user.displayName;
        } else if (user.email) {
          // Extract name from email (before @) and format it
          const emailPrefix = user.email.split('@')[0];
          // Split by dots or underscores and capitalize each word
          this.userName = emailPrefix
            .split(/[._]/)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }
        
        try {
          const key = `${WELCOME_KEY_PREFIX}${user.uid}`;
          const pending = localStorage.getItem(key);
          if (pending) {
            this.showWelcome = true;
            this.isFirstLogin = true;
            // clear pending so it doesn't show again
            localStorage.removeItem(key);
          }
        } catch (e) {
          // ignore storage errors
        }
      }
    });
  }

  pendingCount(): number {
    return this.items.filter(a => a.status === 'pendiente').length;
  }

  completedCount(): number {
    return this.items.filter(a => a.status === 'completada').length;
  }

  totalCount(): number {
    return this.items.length;
  }

  closeWelcome() {
    this.showWelcome = false;
  }
}
