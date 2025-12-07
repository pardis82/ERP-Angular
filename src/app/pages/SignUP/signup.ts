import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextField } from '../../components/text-field/text-field';
import { UserNameValidationService } from '../../services/validation/UserName/user-name-validation';
import { PasswordValidationService } from '../../services/validation/Password/password-validation';

@Component({
  selector: 'app-sign-up-form',
  imports: [TextField, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
})
export class SignUp implements OnInit {
  private fb = inject(FormBuilder);
  private passvalidation = inject(PasswordValidationService);
  private usernvalidation = inject(UserNameValidationService);
  signUpForm!: FormGroup;
  formValid = signal(false);

  // Create signals for form values to trigger computed updates
  formValues = signal({
    username: '',
    password: '',
  });

  constructor() {}

  ngOnInit() {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required], // Add appropriate validators
      password: ['', Validators.required],
    });
    // Listen to form value changes and update the signal
    this.signUpForm.valueChanges.subscribe((values) => {
      this.formValues.set({
        username: values.username || '',
        password: values.password || '',
      });
    });
  }

  // Update computed properties to use the formValues signal
  passwordValidation = computed(() =>
    this.passvalidation.validatePassword(this.formValues().password)
  );

  usernameValidation = computed(() =>
    this.usernvalidation.validateUsername(this.formValues().username)
  );

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);
}
