import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextField } from '../../../components/text-field/text-field';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './login-form.html',
})
export class LoginForm {
  private fb = inject(FormBuilder);

  public loginSubmit = output<{ username: string; password: string; rememberMe: boolean }>();
  public loginForm: FormGroup;
  public rememberMe = signal(false);

  // 1. Initialized in constructor (like SignUpForm) so it's ready immediately
  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  // 2. Removed 'isFormValid' signal because it doesn't work with standard Forms

  onSubmit() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      this.loginSubmit.emit({
        username: data.username,
        password: data.password,
        rememberMe: this.rememberMe(),
      });
    }
  }
}