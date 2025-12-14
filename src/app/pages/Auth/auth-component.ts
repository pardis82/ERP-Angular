import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignUpForm } from './sign-up-form/sign-up-form';
import { LoginForm } from './login-form/login-form';
import { VerificationCode } from '../../components/verification-code/verification-code';
import { PhoneNumberValidationService } from '../../services/validation/phone-number-validation';
import { PasswordValidationService } from '../../services/validation/pass-validation';
import { TextField } from '../../components/text-field/text-field';
import { routePaths } from '../../config/route-paths';
import { skipToast } from '../../core/http-utils';
import { CommonModule } from '@angular/common';

export type Mode = 'Login' | 'SignUp' | 'user-profile' | 'ForgotPass-PhoneCodeEntry' | 'Reset-Pass';

@Component({
  selector: 'app-auth-component',
  standalone: true,
  imports: [SignUpForm, LoginForm, VerificationCode, TextField, ReactiveFormsModule, CommonModule],
  templateUrl: './auth-component.html',
})
export class AuthComponent implements OnDestroy, OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private phoneValidation = inject(PhoneNumberValidationService);
  private passValidation = inject(PasswordValidationService);

  public AuthMode = signal<Mode>('SignUp');
  public PhoneNumber = signal('');
  public captchaInput = signal(0);
  public verificationCodeSent = signal('345678');
  public isVerificationLoading = signal(false);
  public isLoading = signal(false);

  public loginAttempts = signal(0);
  public isCodeSent = signal(false);
  public remainingTime = signal(60);
  private readonly OTP_DURATION = 60;
  private timerInterval: any;

  public phoneForm: FormGroup;
  public resetPassForm: FormGroup;
  public phoneUnmet = signal<string[]>([]);
  public enteredVerificationCode = '';

  public passwordScore = signal(0);
  public passwordColor = signal('');
  public passwordPercentage = signal(0);
  public passwordUnmet = signal<string[]>([]);

  public shouldShowcaptcha = computed(() => this.loginAttempts() >= 5);
  public isInLoginMode = computed(() => this.AuthMode() === 'Login');
  public isInSignUpMode = computed(() => this.AuthMode() === 'SignUp');
  public isInPhoneEntryMode = computed(
    () => this.AuthMode() === 'SignUp' || this.AuthMode() === 'ForgotPass-PhoneCodeEntry'
  );
  public isInUserProfileMode = computed(() => this.AuthMode() === 'user-profile');
  public isInPassResetMode = computed(() => this.AuthMode() === 'Reset-Pass');
  public pageTitle = computed(() => {
    if (this.AuthMode() === 'SignUp') return 'ساخت حساب کاربری';
    if (this.AuthMode() === 'ForgotPass-PhoneCodeEntry') return 'بازیابی رمز عبور';
    return '';
  });
  public isTimeUp = computed(() => this.remainingTime() === 0);
  // فرمت نمایش تایمر (مثلا 01:30)
  public formattedTime = computed(() => {
    const minutes = Math.floor(this.remainingTime() / 60);
    const seconds = this.remainingTime() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  constructor() {
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
    });
    this.phoneForm.get('phoneNumber')?.valueChanges.subscribe((value) => {
      this.updatePhoneValidation(value);
    });
    this.phoneForm.get('captcha')?.valueChanges.subscribe((val) => {
      if (val) {
        this.captchaInput.set(Number(val));
      } else {
        this.captchaInput.set(0);
      }
    });

    this.resetPassForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    this.resetPassForm.get('newPassword')?.valueChanges.subscribe((val) => {
      this.updateValidationSignal({ password: val });
    });
  }

  ngOnInit(): void {
    this.phoneForm.get('phoneNumber')?.valueChanges.subscribe((val) => {
      if (this.phoneForm.enabled && this.isCodeSent() && val !== this.PhoneNumber()) {
        this.isCodeSent.set(false);
        this.verificationCodeSent.set('');
      }
    });
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

  updateValidationSignal(val: any) {
    if (!val) {
      this.passwordScore.set(0);
      this.passwordColor.set('');
      this.passwordPercentage.set(0);
      this.passwordUnmet.set([]);
      return;
    }
    const passResult = this.passValidation.validatePassword(val.password);
    this.passwordScore.set(passResult.extra.score);
    this.passwordColor.set(passResult.extra.color);
    this.passwordPercentage.set(passResult.extra.percentage);
    this.passwordUnmet.set(passResult.helper);
  }

  updatePhoneValidation(phone: string) {
    if (phone) {
      const result = this.phoneValidation.validatePhoneNumber(phone);
      this.phoneUnmet.set(result.unmet);
    } else {
      this.phoneUnmet.set([]);
    }
  }

  requestVerificationCode() {
    if (this.phoneUnmet().length > 0 || this.phoneForm.invalid) return;
    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);

      const currentPhone = this.phoneForm.get('phoneNumber')?.value;
      this.PhoneNumber.set(currentPhone);
      this.isCodeSent.set(true);
      this.phoneForm.disable();
      this.startTimer();
    }, 2000);
  }

  startTimer() {
    this.stopTimer();
    this.remainingTime.set(this.OTP_DURATION);
    this.timerInterval = setInterval(() => {
      if (this.remainingTime() > 0) {
        this.remainingTime.update((t) => t - 1);
      } else {
        this.handleTimerExpiration();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleTimerExpiration() {
    this.phoneForm.enable();
    this.stopTimer();
  }

  resendCode() {
    setTimeout(() => {
      this.enteredVerificationCode = '';
      this.verificationCodeSent.set('');
    }, 1000);

    this.requestVerificationCode();
  }

  onCodeChange(result: { success: boolean; code: string }) {
    this.enteredVerificationCode = result.code;
  }

  // --- SUBMIT HANDLERS ---
  handlePhoneSubmit(): void {
    const phoneValue = this.phoneForm.get('phoneNumber')?.value;
    const validation = this.phoneValidation.validatePhoneNumber(phoneValue);

    if (validation.isValid) {
      this.PhoneNumber.set(phoneValue);
    } else {
      this.phoneUnmet.set(validation.unmet);
      this.phoneForm.get('phoneNumber')?.markAsDirty();
    }
  }

  handleVerificationCode(result: { success: boolean; code: string }) {
    if (result.success) {
      this.isVerificationLoading.set(true);
      setTimeout(() => {
        this.isVerificationLoading.set(false);
        this.AuthMode.set('user-profile');
      }, 2000);
    } else {
      this.isVerificationLoading.set(false);
      alert('کد تایید اشتباه است');
    }
  }
  submitVerificationCode() {
    if (this.isTimeUp()) return;
    if (!this.enteredVerificationCode) return;
    if (this.enteredVerificationCode === '345678') {
      if (this.AuthMode() === 'SignUp') {
        this.stopTimer();
        this.switchTo('user-profile');
      }

      if (this.AuthMode() === 'ForgotPass-PhoneCodeEntry') {
        this.stopTimer();
        this.switchTo('Reset-Pass');
      }
    } else {
      alert('کد وارد شده صحیح نیست');
    }
  }

  handleFinalSignUp(signUpData: any): void {
    this.isLoading.set(true);
    const fullSignUpData = {
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      nationalCode: signUpData.nationalCode,
      email: signUpData.email,
      password: signUpData.password,
      rulesRegulation: signUpData.rules,
    };

    this.authService.signUp(fullSignUpData, skipToast()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        alert('ثبت نام موفقیت‌آمیز بود!)');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Signup Failed', err);
        alert('خطا در ثبت نام. لطفا دوباره تلاش کنید.');
      },
    });
  }

  handleLoginSubmit(loginData: {
    emailorphone: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
  }) {
    this.isLoading.set(true);
    this.authService.login(loginData, loginData.rememberMe, skipToast()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.loginAttempts.set(0);
        const role = response.role || 'user';
        if (role === 'admin') {
          this.router.navigate(['/', routePaths.adminDashboard]);
        } else {
          this.router.navigate(['/', routePaths.dashboard]);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loginAttempts.update((count) => count + 1);
        console.log(err, 'خطا در لاگین');
        alert(' رمز عبور اشتباه است');
      },
    });
  }

  handlePasswordReset() {
    if (this.resetPassForm.invalid) return;

    const { newPassword, confirmPassword } = this.resetPassForm.value;

    // چک کردن عدم تطابق رمزها
    if (newPassword !== confirmPassword) {
      alert('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    // چک کردن اینکه آیا پسورد قوی است یا نه (آرایه ارورها خالی باشد)
    if (this.passwordUnmet().length > 0) {
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      alert('رمز عبور با موفقیت تغییر کرد.');
      this.switchTo('Login');
    }, 1500);
  }

  switchTo(newMode: Mode) {
    this.AuthMode.set(newMode);
    if (newMode != 'SignUp') {
      this.stopTimer();
      this.isCodeSent.set(false);
      this.phoneForm.reset();
      this.phoneForm.enable();
    }
  }
}
