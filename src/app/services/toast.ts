import { Injectable, signal } from '@angular/core';
export interface ToastProps {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastProps[]>([]);
  succes(message: string) {
    this.add(message, 'success');
  }
  error(message: string) {
    this.add(message, 'error');
  }
  info(message: string) {
    this.add(message, 'info');
  }
  warning(message: string) {
    this.add(message, 'warning');
  }

  private add(message: string, type: ToastProps['type']) {
    const id = Date.now();
    const newToast: ToastProps = { id, message, type };
    this.toasts.update((current) => [...current, newToast]);
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }
  remove(id: number) {
    this.toasts.update((current) => current.filter((f) => f.id !== id));
  }
}
