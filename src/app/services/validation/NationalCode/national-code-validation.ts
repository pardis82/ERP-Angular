import { Injectable } from '@angular/core';

export interface InationalCodeRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NationalCodeValidationService {
  validateNationalCode(code: string | number): InationalCodeRequirements {
    const unmet: string[] = [];

    if (code === null || code === undefined) {
      unmet.push('کد ملی الزامی است');
      return { isValid: false, unmet };
    }

    const cleanCode = String(code).trim();

    if (!/^\d{10}$/.test(cleanCode)) {
      unmet.push('کد ملی باید ۱۰ رقم باشد');
      return { isValid: false, unmet };
    }

    //برای جلوگیری از تکرار یک رقم ده بار

    if (/^(\d)\1{9}$/.test(cleanCode)) {
      unmet.push('کد ملی نامعتبر است');
      return { isValid: false, unmet };
    }

    //رقم آخر کد ملی یک محاسبات خاصی داره
    const controlDigit = Number(cleanCode[9]);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number(cleanCode[i]) * (10 - i);
    }

    const remainder = sum % 11;
    const isValidChecksum =
      (remainder < 2 && controlDigit === remainder) ||
      (remainder >= 2 && controlDigit === 11 - remainder);

    if (!isValidChecksum) {
      unmet.push('کد ملی معتبر نیست');
    }

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }
}
