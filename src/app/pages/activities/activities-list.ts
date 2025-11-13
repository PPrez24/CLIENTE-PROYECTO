import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { ActivitiesService, Activity } from '../../shared/services/activities';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './activities-list.html',
  styleUrl: './activities-list.scss'
})
export class ActivitiesList implements OnInit {
  items: Activity[] = [];
  currentView: 'month' | 'week' | 'list' = 'month';
  currentMonth: Date = new Date();
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  hours = Array.from({length: 12}, (_, i) => i + 8); // 8 AM to 7 PM

  constructor(private svc: ActivitiesService) {}

  ngOnInit() {
    this.items = this.svc.list();
  }

  setView(view: 'month' | 'week' | 'list') {
    this.currentView = view;
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
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
      const activityDate = new Date(activity.date);
      return activityDate.toDateString() === date.toDateString();
    });
  }

  getWeekDayDate(dayName: string): Date {
    const today = new Date();
    const dayIndex = this.weekDays.indexOf(dayName);
    const currentDay = today.getDay();
    const diff = dayIndex - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  }

  getActivitiesForTimeSlot(dayName: string, hour: number): Activity[] {
    const dayDate = this.getWeekDayDate(dayName);
    return this.items.filter(activity => {
      if (!activity.time) return false;
      const activityDate = new Date(activity.date);
      const [activityHour] = activity.time.split(':').map(Number);
      return activityDate.toDateString() === dayDate.toDateString() && activityHour === hour;
    });
  }

  get sortedActivities(): Activity[] {
    return this.items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
