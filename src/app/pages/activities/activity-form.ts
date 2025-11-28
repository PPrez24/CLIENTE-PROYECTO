import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivitiesService, ActivityType } from '../../shared/services/activities';
import { SocketService } from '../../shared/services/socket.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, ToastComponent],
  templateUrl: './activity-form.html',
  styleUrls: ['./activity-form.scss']
})
export class ActivityForm implements OnInit {
  isEdit = false;
  private activityId: string | null = null;

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
    private route: ActivatedRoute,
    private router: Router,
    private activities: ActivitiesService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const templateId = this.route.snapshot.queryParamMap.get('template');

    if (id) {
      const existing = this.activities.getById(id);
      if (existing) {
        this.isEdit = true;
        this.activityId = id;
        this.model = {
          title: existing.title,
          date: existing.date,
          time: existing.time,
          location: existing.location,
          type: existing.type,
          status: existing.status
        };
      } else {
        this.toast.show('La actividad no existe.', 'error');
        this.router.navigate(['/app/activities']);
      }
    } else if (templateId) {
      this.applyTemplate(templateId);
    } else {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        this.model.date = `${y}-${m}-${d}`;
    }
  }

  private applyTemplate(templateId: string) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    switch (templateId) {
      case 'clases-diarias': {
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
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
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
        break;
    }
  }

  save() {
    if (this.isEdit && this.activityId) {
      const updated = this.activities.update(this.activityId, { ...this.model });
      if (updated) {
        this.toast.show('Actividad actualizada correctamente.', 'success');
        this.socket.emit('activity:updated', updated);
      } else {
        this.toast.show('No se pudo actualizar la actividad.', 'error');
      }
    } else {
      const created = this.activities.create({ ...this.model });
      this.toast.show('Actividad creada correctamente.', 'success');
      this.socket.emit('activity:created', created);
    }

    this.router.navigate(['/app/activities']);
  }

  cancel() {
    this.router.navigate(['/app/activities']);
  }
}
