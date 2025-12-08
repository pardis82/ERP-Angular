import { Component } from '@angular/core';
import { HasPermission } from '../../directives/has-permission';

@Component({
  selector: 'app-admin-dashboard',
  imports: [HasPermission],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  testError() {
    console.log('دکمه زده شد...');
    throw new Error('این یک خطای تستی است که با دکمه ایجاد شده!');
  }
}
