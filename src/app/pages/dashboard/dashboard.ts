import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ActivitiesService, Activity } from '../../shared/services/activities';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  items: Activity[] = [];

  constructor(private svc: ActivitiesService) {}

  ngOnInit() {
    this.items = this.svc.list();
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

  upcomingActivities(): Activity[] {
    const today = new Date().toISOString().split('T')[0];
    return this.items
      .filter(a => a.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }
}
