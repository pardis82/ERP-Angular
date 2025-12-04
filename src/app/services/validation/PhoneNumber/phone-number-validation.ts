import { Injectable } from '@angular/core';

export interface Iphonenumbervalidation {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PhoneNumberValidationService {
  validatePhoneNumber(phonenumber: string): Iphonenumbervalidation {
    const unmet: string[] = [];

    if (!phonenumber || phonenumber.trim().length === 0) {
      unmet.push('شماره تلفن الزامی است');
      return { isValid: false, unmet };
    }

    const cleaned = phonenumber.trim().replace(/[\s\-()]/g, ''); // حذف اسپیس و دش و پارانتز و جاگذاری آنها با هیچی

    // باید شماره تلفن با 09 شروع بشه و به جز اون فقط 9 رقم دیگه داشته باشه
    if (!/^09\d{9}$/.test(cleaned)) {
      unmet.push('فرمت شماره موبایل معتبر نمی باشد (باید با 09 شروع شده و 11 رقمی باشد)');
    }
    if (cleaned.length !== 11) {
      unmet.push('شماره تلفن باید 11 رقم باشد');
    }

    return { isValid: unmet.length === 0, unmet };
  }
}
