import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  dismiss(id: number): void {
    this.toastService.remove(id);
  }

  trackById(_: number, toast: Toast): number {
    return toast.id;
  }

  getIcon(type: Toast['type']): string {
    return type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌';
  }
}
