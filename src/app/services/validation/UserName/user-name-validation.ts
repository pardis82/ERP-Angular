import { Injectable } from '@angular/core';

export interface IusernameValidation {
  valid: boolean;
  unmet: string[];
}
@Injectable({
  providedIn: 'root',
})
export class UserNameValidationService {
  validateUsername(userName: string): IusernameValidation {
    const unmet: string[] = [];
    const trimmed = userName.trim();

    if (trimmed.trim().length === 0) {
      return { valid: false, unmet: [] };
    }

    if (trimmed.length < 4 || trimmed.length > 20) {
      unmet.push('نام کاربری باید حداقل 4 و حداکثر 20 کاراکتر باشد.');
    }
    if (!/^[A-Za-z]/.test(trimmed)) {
      unmet.push('نام کاربری باید با یک حرف شروع شود.');
    }
    if (!/^[A-Za-z0-9_]+$/.test(trimmed)) {
      unmet.push('در نام کاربری باید تنها از حروف بزرگ و کوچک و _ استفاده شود.');
    }

    return {
      valid: unmet.length === 0,
      unmet,
    };
  }
}
