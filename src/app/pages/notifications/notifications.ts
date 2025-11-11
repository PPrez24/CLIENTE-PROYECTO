import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastComponent } from '../ui/toast/toast'; // si este archivo está en /pages/notifications, ajusta:
                                                   // '../ui/toast/toast' (lo más probable)
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Header, Footer, ToastComponent],
  template: `
    <app-header></app-header>
    <main class="container">
      <h1>Notificaciones</h1>
      <button (click)="ok()">Mostrar toast de éxito</button>

      <hr>
      <button (click)="confirm()">Eliminar registro</button>
    </main>
    <app-toast></app-toast>
    <app-footer></app-footer>
  `
})
export class NotificationsPage {
  constructor(private toast: ToastService) {}

  ok() { this.toast.show('Se creó correctamente'); }

  confirm() {
    const yes = confirm('¿Deseas eliminar este registro?');
    this.toast.show(yes ? 'Eliminado' : 'Cancelado');
  }
}
