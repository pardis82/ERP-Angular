import { Component, inject, output, signal, input, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TextField } from '../../../components/text-field/text-field';
import { PhoneNumberValidationService } from '../../../services/validation/phone-number-validation';
import { EmailValidationService } from '../../../services/validation/email-validation';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private phonevalidation = inject(PhoneNumberValidationService);
  private emailvalidation = inject(EmailValidationService);

  private customPhoneValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const result = this.phonevalidation.validatePhoneNumber(value);
      this.inputErrors.set(result.unmet);
      return result.isValid ? null : { invalidPhone: true };
    };
  }

  private customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const result = this.emailvalidation.validateEmail(value);
      this.inputErrors.set(result.unmet);
      return result.isValid ? null : { invalidEmail: true };
    };
  }
  public loginSubmit = output<{
    emailorphone: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
  }>();
  public shouldShowCaptcha = input<boolean>(false);
  public ForgotPassClick = output<void>();
  public loginForm: FormGroup;
  public rememberMe = signal(false);
  public inputType = signal<'email' | 'phonenumber' | 'unknown'>('phonenumber');
  public inputErrors = signal<string[]>([]);

  constructor() {
    this.loginForm = this.fb.group({
      emailorphone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captcha: [''],
    });
    this.loginForm.get('emailorphone')?.valueChanges.subscribe((val) => {
      this.handleInputTypeAndValidation(val);
    });

    effect(() => {
      const captchaControl = this.loginForm.get('captcha');
      if (this.shouldShowCaptcha()) {
        captchaControl?.setValidators([Validators.required]);
      } else {
        captchaControl?.clearValidators();
      }
      captchaControl?.updateValueAndValidity();
    });
  }

  handleInputTypeAndValidation(value: string) {
    const control = this.loginForm.get('emailorphone');
    if (!value) {
      this.inputType.set('unknown');
      this.inputErrors.set([]);
      return;
    }
    const isPhone = /^[0-9]/.test(value);
    const isEmail = /[A-za-z]/.test(value) || /@/.test(value);
    if (isPhone) {
      if (this.inputType() !== 'phonenumber') {
        this.inputType.set('phonenumber');
        control?.setValidators([Validators.required, this.customPhoneValidation()]);
        control?.updateValueAndValidity({ emitEvent: false });
      }
    } else if (isEmail) {
      if (this.inputType() !== 'email') {
        this.inputType.set('email');
        control?.setValidators([Validators.required, this.customEmailValidator()]);
        control?.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      this.loginSubmit.emit({
        emailorphone: data.emailorphone,
        password: data.password,
        rememberMe: this.rememberMe(),
        captcha: data.captcha,
      });
    }
  }
}
