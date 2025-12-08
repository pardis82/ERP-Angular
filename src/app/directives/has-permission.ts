import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from '../services/permission';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermission {
  permission = input.required<string[] | string>({ alias: 'appHasPermission' });
  private templateRef = inject(TemplateRef);
  private viewContainert = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);
  constructor() {
    effect(() => {
      const requiredPermission = this.permission();
      const hasAccess = this.permissionService.hasPermission(requiredPermission);
      console.log('🔍 بررسی مجوز:', {
        مجوز_مورد_نیاز: requiredPermission,
        آیا_دسترسی_دارد: hasAccess,
        نقش_کاربر: this.permissionService.authService.currentUser()?.role, // چک کنیم نقش چیه
      });
      this.viewContainert.clear();
      if (hasAccess) {
        this.viewContainert.createEmbeddedView(this.templateRef);
      }
    });
  }
}
