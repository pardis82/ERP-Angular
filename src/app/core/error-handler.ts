import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LoggingService } from '../services/log/logging';
import { ToastService } from '../services/toast/toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggingService);
  private toast = inject(ToastService);
  handleError(error: any): void {
    const message = error.message || error.toString();
    const stack = error.stack || 'No stack trace';
    this.logger.logError(message, stack);
    this.toast.error('یک خطای غیر منتظره رخ داد!');

    console.error('Globsl error:', error);
  }
}
