import { Injectable } from '@angular/core';

export type ActivityType = 'Académico'|'Deportivo'|'Cultural'|'Voluntariado';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  date: string;    // ISO yyyy-mm-dd
  time?: string;   // HH:mm
  location?: string;
  status: 'pendiente' | 'completada';
}

const STORAGE_KEY = 'agenda_activities_v1';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private activities: Activity[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.activities = JSON.parse(raw);
      } else {
        // Datos de ejemplo sólo la primera vez
        this.activities = [
          { id: 'a1', title: 'Proyecto de Web - Sprint 1', type: 'Académico', date: '2025-11-15', time: '10:00', location: 'Sala de Cómputo 101', status: 'pendiente' },
          { id: 'a2', title: 'Entrenamiento fútbol', type: 'Deportivo', date: '2025-11-16', time: '18:00', location: 'Cancha Norte', status: 'pendiente' },
          { id: 'a3', title: 'Voluntariado comedor', type: 'Voluntariado', date: '2025-11-20', time: '09:00', location: 'Comedor Central', status: 'completada' }
        ];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('No se pudo leer actividades de localStorage', e);
      this.activities = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activities));
    } catch (e) {
      console.warn('No se pudo guardar actividades en localStorage', e);
    }
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as any).randomUUID();
    }
    return 'a_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  }

  list(): Activity[] {
    // devolvemos copia ordenada por fecha/hora
    return [...this.activities].sort(
      (a, b) => new Date(a.date + 'T' + (a.time || '00:00')).getTime()
              - new Date(b.date + 'T' + (b.time || '00:00')).getTime()
    );
  }

  getById(id: string): Activity | undefined {
    return this.activities.find(a => a.id === id);
  }

  create(data: Omit<Activity, 'id'>): Activity {
    const newActivity: Activity = {
      ...data,
      id: this.generateId()
    };
    this.activities = [newActivity, ...this.activities];
    this.saveToStorage();
    return newActivity;
  }

  update(id: string, changes: Partial<Omit<Activity, 'id'>>): Activity | undefined {
    const idx = this.activities.findIndex(a => a.id === id);
    if (idx === -1) return undefined;

    const updated: Activity = { ...this.activities[idx], ...changes };
    this.activities[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  remove(id: string): boolean {
    const before = this.activities.length;
    this.activities = this.activities.filter(a => a.id !== id);
    if (this.activities.length !== before) {
      this.saveToStorage();
      return true;
    }
    return false;
  }
}
