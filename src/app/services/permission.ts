import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { rolePermissions } from '../config/permissions';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  authService = inject(AuthService);
  myPermissions = computed(() => {
    const user = this.authService.currentUser();
    if (!user || user == null) {
      return [];
    }
    const role = user.role;
    const permissions = rolePermissions[role] || [];
    return permissions;
  });

  hasPermission(perms: string[] | string) {
    const permsToCheck = Array.isArray(perms) ? perms : [perms];
    return permsToCheck.some((p) => this.myPermissions().includes(p));
  }
}
