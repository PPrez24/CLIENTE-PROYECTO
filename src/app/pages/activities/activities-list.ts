import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ActivitiesService, Activity } from '../../shared/services/activities';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './activities-list.html'
})
export class ActivitiesList implements OnInit {
  items: Activity[] = [];

  constructor(private svc: ActivitiesService) {}

  ngOnInit() {
    this.items = this.svc.list(); // <- ya no antes de inicializar el svc
  }
}
