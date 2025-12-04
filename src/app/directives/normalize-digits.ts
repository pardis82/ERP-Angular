import { Directive, ElementRef, HostListener, Input, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DigitNormalizationService } from '../services/normalization/digit-normalization';
@Directive({
  selector: '[appNormalizeDigits]',
  standalone: true,
  //میایم اون سرویس که برای تبدیل کاراکتر های عربی و فارسی نوشتیم رو اینجا به عنوان value accessor میدیم تا بر روی همه ی فرم ها به عنوان یک فرم کنترل اعمال بشه
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NormalizeDigitsDirective),
      multi: true,
    },
  ],
})
export class NormalizeDigitsDirective implements ControlValueAccessor {
  //اینجا میایم به عنوان اینپوت تعریف میکنیم این دایرکتیو رو تا از بیرون بتونیم بهش مقدار بدیم مثلا اگه روی یه اینپوتی خواستیم مثلا اعمال نکنیم
  @Input('appNormalizeDigits') appNormalizedDigits = true;

  private digitService = inject(DigitNormalizationService);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // ما hostlistener رو اضافه میکنیم تا به یک اتفاق خاصی در کامپوننت پدری که دایرکتیو اونجا استفاده میشه گوش کنیم
  //اینجا دونه دونه مواردی که کاربر وارد میکنه رو بررسی میکنه
  @HostListener('input', ['$event'])
  handleInput(event: Event): void {
    if (!this.appNormalizedDigits) return;

    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    this.normalizeAndUpdate(input.value);
  }
  //اینجا دوباره وقتی کاربر از فوکس درمیاد اینپوتش بازم چک میکنه
  // Triggered when user leaves the field
  @HostListener('blur')
  handleBlur(): void {
    this.onTouched();
    if (!this.appNormalizedDigits) return;

    const input = this.el.nativeElement;
    const value = input.value;

    // Normalize if needed
    this.normalizeAndUpdate(value);
  }

  // Normalize + update Angular form control
  private normalizeAndUpdate(value: string): void {
    const normalized = this.digitService.convertNonEnglishDigits(value);

    if (value !== normalized) {
      this.el.nativeElement.value = normalized;
      //اینجا مطمئن میشه فرم ها میفهمن که مقدار جدید شده
      this.onChange(normalized);
    } else {
      this.onChange(value);
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value === undefined || value === null) {
      this.el.nativeElement.value = '';
      return;
    }

    const normalized = this.digitService.convertNonEnglishDigits(String(value));
    this.el.nativeElement.value = normalized;
  }

  //به فرم اطلاع میده اطلاعا تغییر کرده
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  //به فرم اطلاع میده به اینپوت دست بردیم و تغییراتی اعمل کردیم
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  //اگر فرم اینپوتی رو غیرفعال کنه میتونیم اینجا ازش استفاده کنیم
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.el.nativeElement.disabled = isDisabled;
  }
}
