import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission';
import { routePaths } from '../../config/route-paths';

export const permissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const permissionService = inject(PermissionService);
  const requiredPermission = route.data['permission'] as string | string[];
  if (!requiredPermission) {
    return true;
  }
  if (permissionService.hasPermission(requiredPermission)) {
    return true;
  }
  console.warn('⛔️ دسترسی غیرمجاز به:', state.url);
  return router.createUrlTree(['/', routePaths.accessDenied]);
};
