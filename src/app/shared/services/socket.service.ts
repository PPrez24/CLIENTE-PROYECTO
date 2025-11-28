import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io('/', {
        withCredentials: false
      });
    }
  }

  emit(event: string, payload: any) {
    if (!this.socket) return;
    this.socket.emit(event, payload);
  }

  on<T = any>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      if (!this.socket) {
        observer.complete();
        return;
      }

      const handler = (data: T) => observer.next(data);
      this.socket.on(event, handler);

      return () => {
        this.socket?.off(event, handler);
      };
    });
  }
}
