import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';

type ActivityType = 'Académico'|'Deportivo'|'Cultural'|'Voluntariado';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, ToastComponent],
  templateUrl: './activity-form.html'
})
export class ActivityForm {
  // ✅ agrega las propiedades que usa tu template
  model: {
    title: string;
    date: string;       // yyyy-mm-dd
    time?: string;      // HH:mm
    location?: string;
    type: ActivityType; // usado en el <select>
    status: 'pendiente' | 'completada';
  } = {
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Académico',
    status: 'pendiente'
  };

  constructor(private toast: ToastService) {}

  save() {
    this.toast.show('Se creó correctamente');
  }
}
