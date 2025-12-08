import { Component, computed, inject, signal } from '@angular/core';
import { routePaths } from '../../config/route-paths';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignUpForm } from './sign-up-form/sign-up-form';
import { LoginForm } from './login-form/login-form';
import { VerificationCode } from '../../components/verification-code/verification-code';
import { PhoneNumberValidationService } from '../../services/validation/PhoneNumber/phone-number-validation';
import { TextField } from '../../components/text-field/text-field';

export type Mode = 'Login' | 'phone-entry' | 'code-verification' | 'user-profile';
@Component({
  selector: 'app-auth-component',
  imports: [SignUpForm, LoginForm, VerificationCode, TextField],
  templateUrl: './auth-component.html',
})
export class AuthComponent {
  public AuthMode = signal<Mode>('Login');
  public PhoneNumber = signal('');
  public PhoneValidationErrors = signal<string[]>([]);
  public verificationCodeSent = signal('3456');
  public isVerificationLoading = signal(false);
  public isLoading = signal(false);
  private authService = inject(AuthService);
  private router = inject(Router);
  private phoneValidation = inject(PhoneNumberValidationService);

  public isInLoginMode = computed(() => this.AuthMode() === 'Login');
  public isInPhoneEntryMode = computed(() => this.AuthMode() === 'phone-entry');
  public isInCodeVerificationMode = computed(() => this.AuthMode() === 'code-verification');
  public isInUserProfileMode = computed(() => this.AuthMode() === 'user-profile');

  handleLoginSubmit(loginData: { username: string; password: string; rememberMe: boolean }) {
    console.log('--- STARTING LOGIN PROCESS ---');
    this.isLoading.set(true);
    this.authService.login(loginData, loginData.rememberMe).subscribe({
      next: (response) => {
        console.log('Login Success Response:', response);
        this.isLoading.set(false);
        console.log(response);
        if (response.role === 'admin') {
          this.router.navigate(['/', routePaths.adminDashboard]);
        }
        if (response.role === 'user') {
          this.router.navigate(['/', routePaths.dashboard]);
        }
      },
      error: (err) => {
        console.log('--- LOGIN ERROR TRAPPED ---', err);
        this.isLoading.set(false);
        console.log(err, 'خطا در لاگین');
        alert('نام کاربری و یا رمز عبور اشتباه است');
      },
    });
  }

  handlePhoneSubmit(phone: string): void {
    const validation = this.phoneValidation.validatePhoneNumber(phone);
    if (validation.isValid) {
      this.PhoneValidationErrors.set([]);
      this.PhoneNumber.set(phone);
      this.AuthMode.set('code-verification');
    } else {
      this.PhoneValidationErrors.set(validation.unmet);
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

  handleFinalSignUp(signUpData: any): void {
    this.isLoading.set(true);

    // 1. Construct the data for the API
    const fullSignUpData = {
      firstName: 'Test', // Safe for simulation
      lastName: 'User', // Safe for simulation
      username: signUpData.username,
      password: signUpData.password,
      // The API might not use 'nationalCode', but sending it is harmless
      nationalCode: signUpData.nationalCode,
    };

    // 2. Pass 'fullSignUpData' (not signUpData)
    this.authService.signUp(fullSignUpData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        alert('ثبت نام موفقیت‌آمیز بود! (لطفاً با اکانت امیلی وارد شوید)');

        // 3. Smooth transition to Login
        setTimeout(() => {
          this.switchTo('Login');
        }, 1500);
      },
      error: (err) => {
        // 4. Safety catch: Ensure loading stops if request fails
        this.isLoading.set(false);
        console.error('Signup Failed', err);
        alert('خطا در ثبت نام. لطفا دوباره تلاش کنید.');
      },
    });
  }

  switchTo(newMode: Mode) {
    this.AuthMode.set(newMode);
  }

  goBack(): void {
    if (this.AuthMode() === 'user-profile') {
      this.AuthMode.set('code-verification');
    }
    if (this.AuthMode() === 'code-verification') {
      this.AuthMode.set('phone-entry');
    }
  }
}
