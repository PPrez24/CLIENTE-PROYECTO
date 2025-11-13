import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible()" class="toast is-visible" [ngClass]="toastClass()" role="status" aria-live="polite">
      <span class="icon">{{ icon() }}</span>
      {{ text() }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed; right: 2rem; bottom: 2rem;
      padding: 1.5rem 2rem; border-radius: 10px;
      box-shadow: 0 8px 25px rgba(0,0,0,.3);
      color: #fff;
      transform: translateY(20px); transition: .3s ease;
      display: flex; align-items: center; gap: 0.75rem;
      font-weight: 500; font-size: 1.1rem;
      min-width: 350px; max-width: 500px;
    }
    .toast.is-visible { transform: translateY(0); }
    .toast-success { background: #10b981; }
    .toast-error { background: #ef4444; }
    .toast-warning { background: #f59e0b; }
    .toast-info { background: #3b82f6; }
    .icon { font-size: 1.5rem; }
  `]
})
export class ToastComponent {
  text = computed(() => this.toastSvc.message());
  type = computed(() => this.toastSvc.type());
  visible = computed(() => !!this.text());
  toastClass = computed(() => `toast-${this.type()}`);
  icon = computed(() => {
    switch (this.type()) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  });

  constructor(private toastSvc: ToastService) {}
}
