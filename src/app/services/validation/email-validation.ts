import { Injectable } from '@angular/core';

export interface IemailRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
  // الگوی استاندارد ایمیل
  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  validateEmail(email: string): IemailRequirements {
    const unmet: string[] = [];

    // 1. بررسی خالی بودن
    if (!email) {
      unmet.push('پست الکترونیک الزامی است');
      return { isValid: false, unmet };
    }

    if (!this.emailRegex.test(email)) {
      unmet.push('فرمت پست الکترونیک باید مثل test@email.com باشد');
    }

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }
}
