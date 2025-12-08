import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { apiEndpoints } from '../../config/api-endpoints';
import { HasPermission } from '../../directives/has-permission';

@Component({
  selector: 'app-dashboard',
  imports: [HasPermission],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    console.log('🚀 تست درخواست‌های متفاوت...');

    forkJoin([
      this.http.get(`${environment.apiUrl}/${apiEndpoints.auth.me}`),

      this.http.get(`${environment.apiUrl}/${apiEndpoints.auth.me}?q=kala`),

      this.http.get(`${environment.apiUrl}/${apiEndpoints.auth.me}?q=setting`),
    ]).subscribe({
      next: (res) => console.log('✅ همه انجام شدند'),
      error: (err) => console.log('❌ خطا', err),
    });
  }
}
