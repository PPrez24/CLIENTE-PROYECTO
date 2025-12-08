import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Activity } from './activities';

interface UserProfile {
  displayName: string;
  career: string;
  bio: string;
  avatarUrl: string | null;
}

export interface AdminUserInfo {
  uid: string;
  profile: UserProfile | null;
  activities: Activity[];
}

const PROFILE_PREFIX = 'profile_';
const ACTIVITIES_PREFIX = 'agenda_activities_v1_';

@Injectable({ providedIn: 'root' })
export class AdminLocalDataService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  getAllUsers(): AdminUserInfo[] {
    if (!this.isBrowser) return [];

    const profiles = new Map<string, UserProfile>();
    const activities = new Map<string, Activity[]>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (key.startsWith(PROFILE_PREFIX)) {
        const uid = key.substring(PROFILE_PREFIX.length);
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const profile = JSON.parse(raw) as UserProfile;
          profiles.set(uid, profile);
        } catch {}
      }

      if (key.startsWith(ACTIVITIES_PREFIX)) {
        const uid = key.substring(ACTIVITIES_PREFIX.length);
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const acts = JSON.parse(raw) as Activity[];
          activities.set(uid, acts);
        } catch {}
      }
    }

    const uids = new Set<string>([
      ...profiles.keys(),
      ...activities.keys()
    ]);

    const result: AdminUserInfo[] = [];
    for (const uid of uids) {
      result.push({
        uid,
        profile: profiles.get(uid) ?? null,
        activities: activities.get(uid) ?? []
      });
    }

    return result;
  }

  deleteUser(uid: string) {
    if (!this.isBrowser) return;
    localStorage.removeItem(PROFILE_PREFIX + uid);
    localStorage.removeItem(ACTIVITIES_PREFIX + uid);
  }

  deleteActivity(uid: string, activityId: string) {
    if (!this.isBrowser) return;
    const key = ACTIVITIES_PREFIX + uid;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const acts = JSON.parse(raw) as Activity[];
      const filtered = acts.filter(a => a.id !== activityId);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {}
  }

  updateActivity(uid: string, updated: Activity) {
    if (!this.isBrowser) return;
    const key = ACTIVITIES_PREFIX + uid;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const acts = JSON.parse(raw) as Activity[];
      const idx = acts.findIndex(a => a.id === updated.id);
      if (idx === -1) return;
      acts[idx] = updated;
      localStorage.setItem(key, JSON.stringify(acts));
    } catch {}
  }
}
