import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'error' | 'success' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: ToastType = 'error', duration = 4000): void {
    const id = ++this.counter;
    const toast: Toast = { id, message, type };
    this.toastsSubject.next([...this.toastsSubject.getValue(), toast]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number): void {
    this.toastsSubject.next(this.toastsSubject.getValue().filter(t => t.id !== id));
  }
}
