import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logError(stack: any, message: string) {
    console.error('🔴 [Error Logged]:', message);
    console.error('Stack:', stack);

    // this.http.post('/api/logs', { message, stack }).subscribe();
  }
  logWarning(message: string) {
    console.error('⚠️ [Warning]:', message);
  }
  logInfo(message: string) {
    console.error('🔵 [Info]:', message);
  }
}
