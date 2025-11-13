import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);
  type = signal<string>('info');

  show(msg: string, type: string = 'info', ms = 2500) {
    this.message.set(msg);
    this.type.set(type);
    if (ms > 0) setTimeout(() => this.clear(), ms);
  }

  clear() {
    this.message.set(null);
    this.type.set('info');
  }
}
