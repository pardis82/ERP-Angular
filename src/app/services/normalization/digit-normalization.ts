import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DigitNormalizationService {
  private readonly digitMap: Readonly<Record<string, string>> = {
    //Persian digits
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    // Arabic digits
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  //رنج اعداد عربی و فارسی رو میدیم دونه دونه روی اعداد وارد شده میریم و هر کدوم رو طبق مپ با معادلش جا به جا میکنیم
  convertNonEnglishDigits(text: string): string {
    if (!text) return '';
    return text.replace(/[٠-٩۰-۹]/g, (char) => this.digitMap[char] || char);
  }
  //اول تبدیل میکنه به کاراکتر های انگلیسی بعد همه ی غیر اعداد رو پاک میکنه
  extractDigits(text: string): string {
    if (!text) return '';

    const normalized = this.convertNonEnglishDigits(text);
    return normalized.replace(/\D/g, '');
  }
}
