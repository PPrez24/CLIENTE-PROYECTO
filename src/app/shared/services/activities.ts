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
    { id: 'a1', title: 'Proyecto de Web - Sprint 1', type: 'Académico', date: '2025-11-15', time: '10:00', location: 'Sala de Computo 101', status: 'pendiente' },
    { id: 'a2', title: 'Entrenamiento fútbol', type: 'Deportivo', date: '2025-11-16', time: '18:00', location: 'Cancha Norte', status: 'pendiente' },
    { id: 'a3', title: 'Voluntariado comedor', type: 'Voluntariado', date: '2025-11-20', time: '09:00', location: 'Comedor Central', status: 'completada' },
    { id: 'a4', title: 'Examen de Matemáticas', type: 'Académico', date: '2025-11-18', time: '14:00', location: 'Aula 205', status: 'pendiente' },
    { id: 'a5', title: 'Reunión de club de lectura', type: 'Cultural', date: '2025-11-22', time: '17:00', location: 'Biblioteca', status: 'pendiente' },
    { id: 'a6', title: 'Taller de fotografía', type: 'Cultural', date: '2025-11-25', time: '16:00', location: 'Sala de Arte', status: 'pendiente' },
    { id: 'a7', title: 'Partido de básquetbol', type: 'Deportivo', date: '2025-11-19', time: '19:00', location: 'Gimnasio', status: 'completada' },
    { id: 'a8', title: 'Presentación de proyecto final', type: 'Académico', date: '2025-11-28', time: '11:00', location: 'Auditorio', status: 'pendiente' }
  ];

  list() { return this.activities; }
  add(a: Activity) { this.activities = [a, ...this.activities]; }
}