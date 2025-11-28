import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { FirebaseAuthService } from '../../shared/services/firebase-auth';
import { ToastComponent } from '../ui/toast/toast';
import { ToastService } from '../../shared/services/toast';
import { SocketService } from '../../shared/services/socket.service';

interface UserProfile {
  displayName: string;
  career: string;
  bio: string;
  avatarUrl: string | null;
}

const PROFILE_STORAGE_KEY_PREFIX = 'profile_';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, ToastComponent],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfilePage implements OnInit {
  profile: UserProfile = {
    displayName: '',
    career: '',
    bio: '',
    avatarUrl: null
  };

  uploadingAvatar = false;
  saving = false;
  selectedFile: File | null = null;
  private currentUid: string | null = null;
  private isBrowser: boolean;

  constructor(
    private fileUpload: FileUploadService,
    private firebaseAuth: FirebaseAuthService,
    private toast: ToastService,
    private socket: SocketService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // Cargar usuario de Firebase para prefills básicos
    this.firebaseAuth.authState$.subscribe(user => {
      if (!user) return;
      this.currentUid = user.uid;

      // Intentar cargar perfil desde localStorage (demo simple)
      if (this.isBrowser) {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY_PREFIX + user.uid);
        if (raw) {
          try {
            this.profile = JSON.parse(raw);
            return;
          } catch {}
        }
      }

      // Si no hay perfil guardado, rellenar con datos de Firebase
      this.profile.displayName = user.displayName || this.getNameFromEmail(user.email);
      this.profile.career = '';
      this.profile.bio = '';
      this.profile.avatarUrl = user.photoURL || null;
    });

    // Escuchar posibles actualizaciones desde sockets (ejemplo)
    this.socket.on<any>('profileUpdated').subscribe(data => {
      // Si quieres, podrías validar UID, etc.
      // Por ahora solo mostramos que "llegó algo"
      console.log('Evento profileUpdated (socket):', data);
    });
  }

  private getNameFromEmail(email?: string | null): string {
    if (!email) return '';
    const prefix = email.split('@')[0];
    return prefix
      .split(/[._]/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }
    this.selectedFile = input.files[0];

    // Vista previa local rápida
    if (this.isBrowser) {
      const reader = new FileReader();
      reader.onload = e => {
        this.profile.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async uploadAvatar() {
    if (!this.selectedFile) {
      this.toast.show('Selecciona una imagen primero', 'warning');
      return;
    }
    this.uploadingAvatar = true;
    try {
      const resp = await this.fileUpload.upload(this.selectedFile);
      // asumimos que el backend regresa algo como { ok: true, fileUrl: '/uploads/...' }
      if (resp && resp.fileUrl) {
        this.profile.avatarUrl = resp.fileUrl;
        this.toast.show('Foto de perfil actualizada', 'success');

        // Emitir evento por sockets al servidor
        this.socket.emit('profile:updateAvatar', {
          avatarUrl: resp.fileUrl
        });
      } else {
        this.toast.show('La respuesta del servidor no contiene fileUrl', 'error');
      }
    } catch (e) {
      console.error(e);
      this.toast.show('Error al subir la imagen', 'error');
    } finally {
      this.uploadingAvatar = false;
    }
  }

  saveProfile() {
    this.saving = true;
    try {
      // Demo: Guardamos en localStorage (simple). Podrías enviarlo a /api/profile si lo deseas.
      if (this.isBrowser && this.currentUid) {
        localStorage.setItem(
          PROFILE_STORAGE_KEY_PREFIX + this.currentUid,
          JSON.stringify(this.profile)
        );
      }

      // Emitimos un evento por sockets para notificar cambio de perfil
      this.socket.emit('profile:updateData', {
        displayName: this.profile.displayName,
        career: this.profile.career,
        bio: this.profile.bio,
        avatarUrl: this.profile.avatarUrl
      });

      this.toast.show('Perfil guardado correctamente', 'success');
    } catch (e) {
      console.error(e);
      this.toast.show('Error al guardar el perfil', 'error');
    } finally {
      this.saving = false;
    }
  }
}
