import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ActivitiesService, Activity } from '../../shared/services/activities';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  items: Activity[] = [];

  constructor(private svc: ActivitiesService) {}

  ngOnInit() {
    this.items = this.svc.list();
  }

  // ✅ usado en el template
  pendingCount(): number {
    return this.items.filter(a => a.status === 'pendiente').length;
  }
}
