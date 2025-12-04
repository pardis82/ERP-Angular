import { Injectable } from '@angular/core';

export interface IPasswordValidation {
  valid: boolean;
  helper: string[];
  extra: {
    score: number;
    color: string;
    percentage: number;
  };
}

export interface IpasswordRequirements {
  requirements: {
    lowerCase: boolean;
    upperCase: boolean;
    hasNumbers: boolean;
    isLengthy: boolean;
    hasSpecialChars: boolean;
  };
  unmet: string[];
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService {
  getPasswordRequirements(password: string): IpasswordRequirements {
    const requirements = {
      lowerCase: /[a-z]/.test(password),
      upperCase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      isLengthy: password.length >= 8,
      hasSpecialChars: /[@$&!#?%]/.test(password),
    };
    const score = Object.values(requirements).filter(Boolean).length;

    const unmet: string[] = [];

    if (!requirements.upperCase) unmet.push('یک حرف بزرگ');
    if (!requirements.lowerCase) unmet.push('یک حرف کوچک');
    if (!requirements.hasNumbers) unmet.push('حداقل یک عدد');
    if (!requirements.hasSpecialChars) unmet.push('حداقل شامل یکی از کاراکتر های (@ # $ % ! ?)');
    if (!requirements.isLengthy) unmet.push('حداقل 8 کاراکتر');
    return { requirements, unmet, score };
  }

  PassPrecentage(score: number): number {
    return (score / 5) * 100;
  }

  StrengthColor(score: number): string {
    if (score <= 0) return 'bg-red-600';
    if (score === 1) return 'bg-red-400';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-yellow-400';
    if (score === 4) return 'bg-yellow-300';
    return 'bg-green-400';
  }

  validatePassword(password: string): IPasswordValidation {
    if (!password || password.trim().length === 0) {
      return {
        valid: false,
        helper: [''],
        extra: {
          color: this.StrengthColor(0),
          score: 0,
          percentage: this.PassPrecentage(0),
        },
      };
    }

    const passwordAnalysis = this.getPasswordRequirements(password);

    return {
      valid: passwordAnalysis.unmet.length === 0,
      helper: passwordAnalysis.unmet,
      extra: {
        score: passwordAnalysis.score,
        color: this.StrengthColor(passwordAnalysis.score),
        percentage: this.PassPrecentage(passwordAnalysis.score),
      },
    };
  }
}
