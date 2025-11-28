import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';
import { SocketService } from '../../shared/services/socket.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Header, Footer, ToastComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsPage {
  showDialog = false;

  constructor(
    private toast: ToastService,
    private socket: SocketService
  ) {
    // Escucha global de eventos broadcast del servidor
    this.socket.on<any>('serverBroadcast').subscribe(msg => {
      if (msg?.type === 'activityCreated') {
        this.toast.show(
          `Nueva actividad creada: ${msg.activity?.title}`,
          'info'
        );
      } else if (msg?.type === 'fileUploaded') {
        this.toast.show(
          `Archivo subido: ${msg.fileName}`,
          'info'
        );
      } else {
        this.toast.show(
          `Evento recibido: ${JSON.stringify(msg)}`,
          'info'
        );
      }
    });
  }

  showSuccess() {
    this.toast.show('¡Actividad creada exitosamente! 🎉', 'success');
  }

  showError() {
    this.toast.show('Error al guardar los cambios. Inténtalo de nuevo.', 'error');
  }

  showWarning() {
    this.toast.show('Advertencia: Campos obligatorios faltantes.', 'warning');
  }

  showInfo() {
    this.toast.show('Nueva actualización disponible en la app.', 'info');
  }

  openDeleteDialog() {
    this.showDialog = true;
  }

  confirmDelete() {
    this.showDialog = false;
    this.toast.show('Actividad eliminada permanentemente.', 'success');
  }

  cancelDelete() {
    this.showDialog = false;
    this.toast.show('Eliminación cancelada.', 'info');
  }
}
