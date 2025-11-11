import { Injectable } from '@angular/core';

export type ActivityType = 'Académico'|'Deportivo'|'Cultural'|'Voluntariado';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  date: string; // ISO yyyy-mm-dd
  time?: string; // HH:mm
  location?: string;
  status: 'pendiente' | 'completada';
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private activities: Activity[] = [
    { id: 'a1', title: 'Proyecto de Web - Sprint 1', type: 'Académico', date: '2025-11-15', time: '10:00', status: 'pendiente' },
    { id: 'a2', title: 'Entrenamiento fútbol', type: 'Deportivo', date: '2025-11-16', time: '18:00', location:'Cancha Norte', status: 'pendiente' },
    { id: 'a3', title: 'Voluntariado comedor', type: 'Voluntariado', date: '2025-11-20', time: '09:00', status: 'completada' }
  ];

  list() { return this.activities; }
  add(a: Activity) { this.activities = [a, ...this.activities]; }
}