import { Injectable } from '@angular/core';

export interface ICompNationalCodeRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CompNationalCodeValidationService {
  validateCompNationalCode(code: string | number): ICompNationalCodeRequirements {
    const unmet: string[] = [];
    if (!code || code === undefined || code === null) {
      unmet.push('کد ملی الزامی است');
      return { isValid: false, unmet };
    }
    const CleanedCode = String(code).trim();
    if (!/^\d{11}$/.test(CleanedCode)) {
      unmet.push('کد ملی باید یازده رقم باشد');
      return { isValid: false, unmet };
    }
    if (/^(\d)\1{10}$/.test(CleanedCode)) {
      unmet.push('کد ملی نامعتبر است');
      return { isValid: false, unmet };
    }

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }
}
