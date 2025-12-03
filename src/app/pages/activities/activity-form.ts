import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, Header, Footer, ToastComponent],
  templateUrl: './activity-form.html',
  styleUrls: ['./activity-form.scss']
})
export class ActivityForm implements OnInit {
  activityForm!: FormGroup;
  isEdit = false;
  private activityId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private activities: ActivitiesService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    this.activityForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['Académico', Validators.required],
      date: [todayStr, [Validators.required, this.futureDateValidator]],
      time: [''],
      location: ['', Validators.required],
      status: ['pendiente', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    const templateId = this.route.snapshot.queryParamMap.get('template');

    if (id) {
      const existing = this.activities.getById(id);
      if (existing) {
        this.isEdit = true;
        this.activityId = id;
        this.activityForm.patchValue({
          title: existing.title,
          date: existing.date,
          time: existing.time,
          location: existing.location,
          type: existing.type,
          status: existing.status
        });
      } else {
        this.toast.show('La actividad no existe.', 'error');
        this.router.navigate(['/app/activities']);
      }
    } else if (templateId) {
      this.applyTemplate(templateId);
    }
  }

  // Validador personalizado para verificar que la fecha no sea pasada
  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { pastDate: true };
  }

  private applyTemplate(templateId: string) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    switch (templateId) {
      case 'clases-diarias': {
        this.activityForm.patchValue({
          title: 'Clase de [Materia]',
          type: 'Académico',
          location: 'Aula 101',
          time: '08:00',
          date: todayStr,
          status: 'pendiente'
        });
        this.toast.show('Plantilla "Horario de clases" aplicada', 'info');
        break;
      }

      case 'proyecto-final': {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        const deadlineStr = deadline.toISOString().slice(0, 10);

        this.activityForm.patchValue({
          title: 'Entrega proyecto final',
          type: 'Académico',
          location: 'Sala de cómputo / Plataforma en línea',
          time: '23:59',
          date: deadlineStr,
          status: 'pendiente'
        });
        this.toast.show('Plantilla "Entrega de proyecto final" aplicada', 'info');
        break;
      }

      default:
        break;
    }
  }

  save() {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const formValue = this.activityForm.value;

    if (this.isEdit && this.activityId) {
      const updated = this.activities.update(this.activityId, formValue);
      if (updated) {
        this.toast.show('Actividad actualizada correctamente.', 'success');
        this.socket.emit('activity:updated', updated);
      } else {
        this.toast.show('No se pudo actualizar la actividad.', 'error');
      }
    } else {
      const created = this.activities.create(formValue);
      this.toast.show('Actividad creada correctamente.', 'success');
      this.socket.emit('activity:created', created);
    }

    this.router.navigate(['/app/activities']);
  }

  cancel() {
    this.router.navigate(['/app/activities']);
  }

  // Getters para acceder a los controles en el template
  get title() { return this.activityForm.get('title'); }
  get type() { return this.activityForm.get('type'); }
  get date() { return this.activityForm.get('date'); }
  get time() { return this.activityForm.get('time'); }
  get location() { return this.activityForm.get('location'); }
  get status() { return this.activityForm.get('status'); }
}
