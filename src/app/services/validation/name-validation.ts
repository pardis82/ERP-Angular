import { Injectable } from '@angular/core';

export interface IfirstNameRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NameValidationService {
  validateFirstName(firstName: string): IfirstNameRequirements {
    const nameMaxChars = 15;
    const nameMinChars = 3;
    const unmet: string[] = [];
    const cleanedFirstName = firstName.replace(/\s+/g, '').trim();

    if (!cleanedFirstName) {
      unmet.push('نام الزامی است');
      return { isValid: false, unmet };
    }

    // Regex برای حروف فارسی و فاصله (اسپیس)
    // \u0600-\u06FF بازه حروف فارسی و عربی است
    if (!/^[\u0600-\u06FF\s]+$/.test(cleanedFirstName)) {
      unmet.push('نام باید تنها شامل حروف فارسی باشد');
    }
    if (cleanedFirstName.length < nameMinChars) {
      unmet.push(`نام نمی‌تواند بیشتر از ${nameMinChars} کاراکتر باشد`);
    }
    if (cleanedFirstName.length > nameMaxChars) {
      unmet.push(`نام نمی‌تواند کمتر از ${nameMaxChars} کاراکتر باشد`);
    }

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }
}
