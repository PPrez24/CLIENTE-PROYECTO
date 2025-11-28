import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ActivitiesService, Activity } from '../../shared/services/activities';
import { ToastService } from '../../shared/services/toast';
import { SocketService } from '../../shared/services/socket.service';
import { ToastComponent } from '../ui/toast/toast';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, ToastComponent],
  templateUrl: './activities-list.html',
  styleUrl: './activities-list.scss'
})
export class ActivitiesList implements OnInit {
  items: Activity[] = [];

  currentView: 'month' | 'week' | 'list' = 'month';
  currentMonth: Date = new Date();

  currentWeekStart!: Date;

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  hours = Array.from({ length: 12 }, (_, i) => i + 8);

  showDeleteDialog = false;
  activityToDelete: Activity | null = null;

  constructor(
    private svc: ActivitiesService,
    private router: Router,
    private toast: ToastService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    this.reload();
    this.currentWeekStart = this.getStartOfWeek(new Date());
  }

  private reload() {
    this.items = this.svc.list();
  }

  private parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); 
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
  }

  private addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  setView(view: 'month' | 'week' | 'list') {
    this.currentView = view;

    if (view === 'week' && !this.currentWeekStart) {
      this.currentWeekStart = this.getStartOfWeek(new Date());
    }

    if (view === 'month') {
      this.currentMonth = new Date();
    }
  }

  previousMonth() {
    if (this.currentView === 'week') {
      this.currentWeekStart = this.addDays(this.currentWeekStart, -7);
      this.currentMonth = new Date(this.currentWeekStart);
    } else {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() - 1,
        1
      );
    }
  }

  nextMonth() {
    if (this.currentView === 'week') {
      this.currentWeekStart = this.addDays(this.currentWeekStart, 7);
      this.currentMonth = new Date(this.currentWeekStart);
    } else {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        1
      );
    }
  }

  get calendarDays(): Date[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getActivitiesForDay(date: Date): Activity[] {
    return this.items.filter(activity => {
      const activityDate = this.parseDate(activity.date);
      return activityDate.toDateString() === date.toDateString();
    });
  }

  getWeekDayDate(dayName: string): Date {
    const dayIndex = this.weekDays.indexOf(dayName); // 0–6
    const base = this.currentWeekStart || this.getStartOfWeek(new Date());
    const d = new Date(base);
    d.setDate(base.getDate() + dayIndex);
    return d;
  }

  getActivitiesForTimeSlot(dayName: string, hour: number): Activity[] {
    const dayDate = this.getWeekDayDate(dayName);
    return this.items.filter(activity => {
      if (!activity.time) return false;
      const activityDate = this.parseDate(activity.date);
      const [activityHour] = activity.time.split(':').map(Number);
      return (
        activityDate.toDateString() === dayDate.toDateString() &&
        activityHour === hour
      );
    });
  }

  get sortedActivities(): Activity[] {
    return [...this.items].sort((a, b) => {
      const da = this.parseDate(a.date);
      const db = this.parseDate(b.date);

      if (a.time) {
        const [h, m] = a.time.split(':').map(Number);
        da.setHours(h || 0, m || 0, 0, 0);
      }
      if (b.time) {
        const [h, m] = b.time.split(':').map(Number);
        db.setHours(h || 0, m || 0, 0, 0);
      }

      return da.getTime() - db.getTime();
    });
  }

  edit(activity: Activity) {
    this.router.navigate(['/app/activities', activity.id, 'edit']);
  }

  askDelete(activity: Activity) {
    this.activityToDelete = activity;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.activityToDelete = null;
  }

  confirmDelete() {
    if (!this.activityToDelete) return;

    const { id, title } = this.activityToDelete;
    const ok = this.svc.remove(id);

    if (ok) {
      this.toast.show(`Actividad "${title}" eliminada.`, 'success');
      this.socket.emit('activity:deleted', { id, title });
      this.reload();
    } else {
      this.toast.show('No se pudo eliminar la actividad.', 'error');
    }

    this.showDeleteDialog = false;
    this.activityToDelete = null;
  }
}
