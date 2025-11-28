import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';
import { ActivatedRoute } from '@angular/router';

type ActivityType = 'Académico' | 'Deportivo' | 'Cultural' | 'Voluntariado';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, ToastComponent],
  templateUrl: './activity-form.html',
  styleUrls: ['./activity-form.scss']
})
export class ActivityForm implements OnInit {
  model: {
    title: string;
    date: string; // yyyy-mm-dd
    time?: string;
    location?: string;
    type: ActivityType;
    status: 'pendiente' | 'completada';
  } = {
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Académico',
    status: 'pendiente'
  };

  constructor(
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const templateId = this.route.snapshot.queryParamMap.get('template');
    if (templateId) {
      this.applyTemplate(templateId);
    }
  }

  private applyTemplate(templateId: string) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    switch (templateId) {
      case 'clases-diarias': {
        // Pensado para bloques de clases en la semana
        this.model = {
          ...this.model,
          title: 'Clase de [Materia]',
          type: 'Académico',
          location: 'Aula 101',
          time: this.model.time || '08:00',
          date: this.model.date || todayStr,
          status: 'pendiente'
        };
        this.toast.show('Plantilla "Horario de clases" aplicada', 'info');
        break;
      }

      case 'proyecto-final': {
        // Pensado para entrega de proyecto grande, con deadline
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7); // por defecto, +7 días
        const deadlineStr = deadline.toISOString().slice(0, 10);

        this.model = {
          ...this.model,
          title: 'Entrega proyecto final',
          type: 'Académico',
          location: 'Sala de cómputo / Plataforma en línea',
          time: this.model.time || '23:59',
          date: this.model.date || deadlineStr,
          status: 'pendiente'
        };
        this.toast.show('Plantilla "Entrega de proyecto final" aplicada', 'info');
        break;
      }

      default:
        // Si el id no coincide, no hacemos nada especial
        break;
    }
  }

  save() {
    this.toast.show('Se creó correctamente la actividad (mock)', 'success');
    // aquí en el futuro puedes integrar con ActivitiesService.add(...)
  }

  resetForm() {
    this.model = {
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'Académico',
      status: 'pendiente'
    };
  }
}
