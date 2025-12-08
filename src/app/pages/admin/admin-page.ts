import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AdminLocalDataService, AdminUserInfo } from '../../shared/services/admin-local-data.service';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';
import { FormsModule } from '@angular/forms';
import type { Activity } from '../../shared/services/activities';
import { AdminApiService } from '../../shared/services/admin-api.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, Header, Footer, ToastComponent, FormsModule],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.scss']
})
export class AdminPage implements OnInit {
  users: AdminUserInfo[] = [];
  selectedUser: AdminUserInfo | null = null;
  editingActivity: Activity | null = null;

  constructor(
    private adminData: AdminLocalDataService,
    private toast: ToastService,
    private adminApi: AdminApiService
  ) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.users = this.adminData.getAllUsers();
    if (this.selectedUser) {
      const match = this.users.find(u => u.uid === this.selectedUser!.uid);
      this.selectedUser = match || null;
    }
  }

  selectUser(u: AdminUserInfo) {
    this.selectedUser = u;
    this.editingActivity = null;
  }

  async deleteUser(u: AdminUserInfo) {
    const confirmDelete = window.confirm(
        `¿Eliminar al usuario "${u.profile?.displayName || u.uid}" y todas sus actividades locales, y borrar su cuenta de Firebase?`
    );
    if (!confirmDelete) return;
    this.adminData.deleteUser(u.uid);
    try {
        const resp = await this.adminApi.deleteUserInFirebase(u.uid);
        if (resp.ok) {
        this.toast.show('Usuario eliminado por completo (datos locales + cuenta Firebase).', 'success');
        } else {
        this.toast.show(resp.message || 'Error al eliminar cuenta en Firebase', 'error');
        }
    } catch (err: any) {
        console.error('deleteUser error', err);
        const msg =
            err?.error?.message ||
            (typeof err?.message === 'string' ? err.message : '') ||
            'Error al llamar al backend para eliminar la cuenta.';
        this.toast.show(msg, 'error');
        }

    this.selectedUser = null;
    this.reload();
  }

  startEdit(a: Activity) {
    this.editingActivity = { ...a };
  }

  cancelEdit() {
    this.editingActivity = null;
  }

  saveActivity() {
    if (!this.selectedUser || !this.editingActivity) return;
    this.adminData.updateActivity(this.selectedUser.uid, this.editingActivity);
    this.toast.show('Actividad actualizada (localmente).', 'success');
    this.editingActivity = null;
    this.reload();
  }

  deleteActivity(a: Activity) {
    if (!this.selectedUser) return;
    const ok = window.confirm(`¿Eliminar la actividad "${a.title}"?`);
    if (!ok) return;

    this.adminData.deleteActivity(this.selectedUser.uid, a.id);
    this.toast.show('Actividad eliminada (localmente).', 'success');
    this.reload();
  }

  activitiesForSelected(): Activity[] {
    return this.selectedUser?.activities ?? [];
  }
}
