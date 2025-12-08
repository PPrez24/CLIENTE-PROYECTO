import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FirebaseAuthService } from './firebase-auth';

export type ActivityType = 'Académico'|'Deportivo'|'Cultural'|'Voluntariado';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  date: string;
  time?: string;
  location?: string;
  status: 'pendiente' | 'completada';
}

const STORAGE_KEY_BASE = 'agenda_activities_v1';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private activities: Activity[] = [];
  private currentUserId: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() private authSvc?: FirebaseAuthService
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      this.activities = [];
      return;
    }

    if (this.authSvc) {
      const initialUser = this.authSvc.authState$.value;
      this.currentUserId = initialUser?.uid || null;
      this.loadFromStorage();

      this.authSvc.authState$.subscribe(user => {
        const newUid = user?.uid || null;
        if (newUid !== this.currentUserId) {
          this.currentUserId = newUid;
          this.loadFromStorage();
        }
      });
    } else {
      this.currentUserId = null;
      this.loadFromStorage();
    }
  }

  private get storageKey(): string {
    const suffix = this.currentUserId ?? 'guest';
    return `${STORAGE_KEY_BASE}_${suffix}`;
  }

  private loadFromStorage() {
    if (!isPlatformBrowser(this.platformId)) {
      this.activities = [];
      return;
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.activities = JSON.parse(raw);
      } else {
        this.activities = [];
      }
    } catch (e) {
      console.warn('No se pudo leer actividades de localStorage', e);
      this.activities = [];
    }
  }

  private saveToStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.activities));
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
    return [...this.activities].sort(
      (a, b) =>
        new Date(a.date + 'T' + (a.time || '00:00')).getTime() -
        new Date(b.date + 'T' + (b.time || '00:00')).getTime()
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
