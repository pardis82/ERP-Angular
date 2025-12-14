import { Injectable } from '@angular/core';
export interface IfirstNameRequirements {
  isValid: boolean;
  unmet: string[];
}
@Injectable({
  providedIn: 'root',
})
export class LastNameValidationService {
  validateLastName(lastName: string): IfirstNameRequirements {
    const lastnameMaxChars: number = 30;
    const lastnameMinChars: number = 3;
    const unmet: string[] = [];
    const cleanedLastName = lastName.replace(/\s+/g, '').trim();
    if (!cleanedLastName) {
      unmet.push('نام خانوادگی الزامی است');
      return { isValid: false, unmet };
    }
    if (!/^[\u0600-\u06FF\s]+$/.test(cleanedLastName)) {
      unmet.push('نام خانوادگی باید تنها شامل حروف فارسی باشد');
    }
    if (cleanedLastName.length < lastnameMinChars) {
      unmet.push(`نام نمی‌تواند کمتر از ${lastnameMinChars} کاراکتر باشد`);
    }
    if (cleanedLastName.length > lastnameMaxChars) {
      unmet.push('نام نمیتواند بیشتر از 30 کاراکتر باشد');
      return { isValid: false, unmet };
    }
    return {
      isValid: unmet.length == 0,
      unmet,
    };
  }
}
