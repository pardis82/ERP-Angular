import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // 1. Imports
import { AuthService } from '../../services/auth.service';
import { SignUpForm } from './sign-up-form/sign-up-form';
import { LoginForm } from './login-form/login-form';
import { VerificationCode } from '../../components/verification-code/verification-code';
import { PhoneNumberValidationService } from '../../services/validation/PhoneNumber/phone-number-validation';
import { TextField } from '../../components/text-field/text-field';
import { routePaths } from '../../config/route-paths';
import { AdminDashboard } from '../../pages/admin-dashboard/admin-dashboard';
import { UserDashboard } from '../../components/dashboard/user-dashboard/user-dashboard';

export type Mode = 'Login' | 'phone-entry' | 'code-verification' | 'user-profile';

@Component({
  selector: 'app-auth-component',
  standalone: true,
  imports: [SignUpForm, LoginForm, VerificationCode, TextField, ReactiveFormsModule], // 2. Add ReactiveModule
  templateUrl: './auth-component.html',
})
export class AuthComponent {
  private fb = inject(FormBuilder); // 3. Inject FormBuilder
  private authService = inject(AuthService);
  private router = inject(Router);
  private phoneValidation = inject(PhoneNumberValidationService);

  // Signals
  public AuthMode = signal<Mode>('Login');
  public PhoneNumber = signal(''); // We keep this to store the *valid* phone for the next step (code view)
  public verificationCodeSent = signal('3456');
  public isVerificationLoading = signal(false);
  public isLoading = signal(false);

  // 4. New Reactive Form & Validation Signals
  public phoneForm: FormGroup;
  public phoneUnmet = signal<string[]>([]);

  public isInLoginMode = computed(() => this.AuthMode() === 'Login');
  public isInPhoneEntryMode = computed(() => this.AuthMode() === 'phone-entry');
  public isInCodeVerificationMode = computed(() => this.AuthMode() === 'code-verification');
  public isInUserProfileMode = computed(() => this.AuthMode() === 'user-profile');

  constructor() {
    // 5. Initialize the Phone Form
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required]]
    });

    // 6. Real-time Validation Subscription
    this.phoneForm.get('phoneNumber')?.valueChanges.subscribe((value) => {
      this.updatePhoneValidation(value);
    });
  }

  // Helper to run your custom validation service
  updatePhoneValidation(phone: string) {
    if (phone) {
      const result = this.phoneValidation.validatePhoneNumber(phone);
      this.phoneUnmet.set(result.unmet);
    } else {
      this.phoneUnmet.set([]);
    }
  }

  // --- SUBMIT HANDLERS ---

  handlePhoneSubmit(): void {
    const phoneValue = this.phoneForm.get('phoneNumber')?.value;
    const validation = this.phoneValidation.validatePhoneNumber(phoneValue);

    if (validation.isValid) {
      // Valid! Save the number to the signal for the UI to show later
      this.PhoneNumber.set(phoneValue);
      this.AuthMode.set('code-verification');
    } else {
      // Invalid! Show errors and mark dirty so UI turns red
      this.phoneUnmet.set(validation.unmet);
      this.phoneForm.get('phoneNumber')?.markAsDirty();
    }
  }

  handleLoginSubmit(loginData: { username: string; password: string; rememberMe: boolean }) {
    this.isLoading.set(true);
    this.authService.login(loginData, loginData.rememberMe).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const role = response.role || 'user';
        if (role === 'admin') {
          this.router.navigate(['/', routePaths.adminDashboard]);
        } else {
          this.router.navigate(['/', routePaths.dashboard]);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err, 'خطا در لاگین');
        alert('نام کاربری و یا رمز عبور اشتباه است');
      },
    });
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
    const fullSignUpData = {
      firstName: 'Test',
      lastName: 'User',
      username: signUpData.username,
      password: signUpData.password,
      nationalCode: signUpData.nationalCode,
    };

    this.authService.signUp(fullSignUpData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        alert('ثبت نام موفقیت‌آمیز بود! (لطفاً با اکانت امیلی وارد شوید)');
        setTimeout(() => {
          this.switchTo('Login');
        }, 1500);
      },
      error: (err) => {
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