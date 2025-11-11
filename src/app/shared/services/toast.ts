import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);

  show(msg: string, ms = 2500) {
    this.message.set(msg);
    if (ms > 0) setTimeout(() => this.clear(), ms);
  }

  clear() {
    this.message.set(null);
  }
}
