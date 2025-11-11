import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible()" class="toast is-visible" role="status" aria-live="polite">
      {{ text() }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed; right: 1rem; bottom: 1rem;
      padding: .75rem 1rem; border-radius: .5rem;
      box-shadow: 0 6px 20px rgba(0,0,0,.2);
      background: #111; color: #fff; opacity: .95;
      transform: translateY(8px); transition: .2s ease;
    }
    .toast.is-visible { transform: translateY(0); }
  `]
})
export class ToastComponent {
  text = computed(() => this.toastSvc.message());
  visible = computed(() => !!this.text());
  constructor(private toastSvc: ToastService) {}
}
