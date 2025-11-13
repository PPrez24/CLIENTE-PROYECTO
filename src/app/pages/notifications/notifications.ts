import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Header, Footer, ToastComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsPage {
  showDialog = false;

  constructor(private toast: ToastService) {}

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
