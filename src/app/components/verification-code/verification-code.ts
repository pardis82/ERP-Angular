import {
  Component,
  input,
  output,
  computed,
  signal,
  effect,
  ViewChildren,
  ElementRef,
  QueryList,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-code',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule],
  templateUrl: './verification-code.html',
})
export class VerificationCode {
  constructor(private fb: FormBuilder) {
    //افکت ها هر وقت dependecy هاشون تغییر کنه تغییر میکنن

    //تعداد باکس هارو میگیریم به آرایه خالی تبدیل میکنیم هر کدام از خانه های خالی رو به یک form control تبدیل میکنیم با مقدار خالی و بعد مقادیر verfication values رو به اون form control ها تغییر میدیم
    effect(() => {
      const count = this.boxNumber();
      const newControls = Array(count)
        .fill(null)
        .map(() => new FormControl(''));
      this.verificationValues.set(newControls);
    });
  }

  //برای اینه که بتونیم این کد اینپوت رو تحت نظر داشته باشیم
  //به همه ی اینپوت هایی که با #codeInput علامت گذاری شدن دسترسی پیدا میکنیم
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  boxNumber = input<number>(6); //how many inputs do we have based on where we want to use it
  boxFilled = output<string>(); //when all boxes are filled we notify the parent
  boxPerChange = output<string>(); // when each box is filled
  maxLength = input<number>(1);
  boxMaxLength = input<number[]>([]);
  verificationValues = signal<FormControl[]>([]);
  containerClassName = input<string>();
  className = input<string>();
  backgroundColor = input<string>(' #ffffffff');
  verificationCode = input<string>('');
  verificationComplete = output<{ success: boolean; code: string }>();

  //اول میایم آرایه boxMaxLength رو میدیم به perbox بعد بررسی میکنیم که آیا آرایه هست یا نه بعد اگر طول ارایه برابر با تعداد باکس ها باشه میاد برای هر ایندکس آرایه ای از تعدادی که داریم میاره
  getMaxLengthPerBox(index: number): number {
    const perBox = this.boxMaxLength();
    if (Array.isArray(perBox) && perBox.length === this.boxNumber()) {
      return perBox[index];
    }
    return this.maxLength();
  }

  //برای هندل کردن بردن فوکس به باکس بعدی در صورت پر شدن اون باکس به مقداری که مکس اعدادی بوده که قبول میکرده
  onInput(event: any, index: any) {
    const value = event.target.value;
    const maxChars = this.getMaxLengthPerBox(index);
    if (value && value.length > 0) this.boxPerChange.emit(value);
    if (value.length === maxChars && index < this.boxNumber() - 1) {
      setTimeout(() => {
        const inputs = this.codeInputs.toArray();
        if (inputs[index + 1]) {
          inputs[index + 1].nativeElement.focus();
        }
      });
    }
    this.checkAllBoxesCorrect();
  }

  //هندل کردن فشار دادن کلید های backspace و arrow راست و چپ
  onKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    if (event.key == 'Backspace') {
      if (currentValue === '' && index >= 0) {
        event.preventDefault();
        setTimeout(() => {
          const inputs = this.codeInputs.toArray();
          if (inputs[index - 1]) {
            inputs[index - 1].nativeElement.focus();
            const prevValue = this.verificationValues()[index - 1].value || '';
            inputs[index - 1].nativeElement.setSelectionRange(prevValue.length, prevValue.length);
          }
        });
      }
    }
    if (event.key == 'ArrowLeft') {
      if (index >= 0) {
        event.preventDefault();
        setTimeout(() => {
          const inputs = this.codeInputs.toArray();
          if (inputs[index - 1]) {
            inputs[index - 1].nativeElement.focus();
          }
        });
      }
    }

    if (event.key === 'ArrowRight') {
      if (index < this.boxNumber() - 1) {
        event.preventDefault();
        setTimeout(() => {
          const inputs = this.codeInputs.toArray();
          if (inputs[index + 1]) {
            inputs[index + 1].nativeElement.focus();
          }
        });
      }
    }
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const totalBoxes = this.boxNumber();
    const controls = this.verificationValues();

    let currentIndex = index;
    let charIndex = 0;

    // از ایندکس فعلی شروع کن و باکس‌ها رو پر کن
    while (currentIndex < totalBoxes && charIndex < pastedText.length) {
      const maxLen = this.getMaxLengthPerBox(currentIndex);
      const currentControl = controls[currentIndex];
      const currentValue = currentControl.value || '';

      // چقدر جا خالی داریم در این باکس؟
      const remainingSpace = maxLen - currentValue.length;

      if (remainingSpace > 0) {
        // بخشی از متن paste شده رو بگیر که در این باکس جا بشه
        const charsToAdd = pastedText.slice(charIndex, charIndex + remainingSpace);
        currentControl.setValue(currentValue + charsToAdd);
        charIndex += charsToAdd.length;
      }

      // اگر این باکس هنوز جا داره، همینجا بمون
      // اگر پر شد، برو باکس بعدی
      if (currentControl.value.length === maxLen) {
        currentIndex++;
      }
    }
    setTimeout(() => {
      this.checkAllBoxesCorrect();
    });
    // فوکس و cursor رو تنظیم کن
    setTimeout(() => {
      const inputs = this.codeInputs.toArray();
      const focusIndex = Math.min(currentIndex, totalBoxes - 1);
      if (inputs[focusIndex]) {
        inputs[focusIndex].nativeElement.focus();

        const controlValue = controls[focusIndex].value || '';
        // اگر در همین باکس موندیم، cursor رو به آخر مقدار جدید ببر
        // اگر به باکس بعدی رفتیم، cursor رو به اولش ببر
        const cursorPos = currentIndex === focusIndex ? controlValue.length : 0;

        inputs[focusIndex].nativeElement.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }

  isBoxCorrect(index: number): boolean {
    const controls = this.verificationValues();
    if (!controls[index]) return false;

    const value = controls[index].value || '';
    const maxLen = this.getMaxLengthPerBox(index);
    const expected = this.verificationCode() || '';
    let startIndex = 0;
    for (let i = 0; i < index; i++) {
      startIndex += this.getMaxLengthPerBox(i);
    }
    const expectedSegment = expected.substring(startIndex, startIndex + maxLen);

    return value === expectedSegment && value.length === maxLen;
  }
  checkAllBoxesCorrect(): void {
    const controls = this.verificationValues();
    const areAllFilled = controls.every((control, index) => {
      const maxLen = this.getMaxLengthPerBox(index);
      return control.value && control.value.length === maxLen;
    });
    if (areAllFilled) {
      const fullCode = controls.map((control) => control.value).join('');
      const success = fullCode === this.verificationCode();
      this.verificationComplete.emit({
        success: success,
        code: fullCode,
      });
      if (success) {
        this.boxFilled.emit(fullCode);
      }
    }
  }
}
