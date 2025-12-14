import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextField } from '../../../components/text-field/text-field';
import { PasswordValidationService } from '../../../services/validation/pass-validation';
import { EmailValidationService } from '../../../services/validation/email-validation';
import { NationalCodeValidationService } from '../../../services/validation/national-code-validation';
import { NameValidationService } from '../../../services/validation/name-validation';
import { LastNameValidationService } from '../../../services/validation/lastname-validation-service';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './sign-up-form.html',
})
export class SignUpForm {
  private fb = inject(FormBuilder);
  private passValidation = inject(PasswordValidationService);
  private nationalCodeValidation = inject(NationalCodeValidationService);
  private emailValidation = inject(EmailValidationService);
  private nameValidation = inject(NameValidationService);
  private lastnameValidation = inject(LastNameValidationService);

  public formSubmit = output<any>();
  signUpForm: FormGroup;

  // Signals for real-time validation feedback
  public passwordScore = signal(0);
  public passwordColor = signal('');
  public passwordPercentage = signal(0);
  public passwordUnmet = signal<string[]>([]);
  public emailUnmet = signal<string[]>([]);
  public nationalCodeUnmet = signal<string[]>([]);
  public firstnameUnmet = signal<string[]>([]);
  public lastnameUnmet = signal<string[]>([]);

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nationalCode: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rules: [false, [Validators.requiredTrue]],
    });
    this.updateValidationSignals(this.signUpForm.value);
    // Listen to changes to update validation signals
    this.signUpForm.valueChanges.subscribe((val) => {
      this.updateValidationSignals(val);
    });
  }

  updateValidationSignals(val: any) {
    if (val.firstName) {
      const firstNameResult = this.nameValidation.validateFirstName(val.firstName);
      this.firstnameUnmet.set(firstNameResult.unmet);
    }
    if (val.lastName) {
      const lastNameResult = this.lastnameValidation.validateLastName(val.lastName);
      this.lastnameUnmet.set(lastNameResult.unmet);
    }
    if (val.nationalCode) {
      const nationalCodeResult = this.nationalCodeValidation.validateNationalCode(val.nationalCode);
      this.nationalCodeUnmet.set(nationalCodeResult.unmet);
    }
    if (val.email) {
      const emailResult = this.emailValidation.validateEmail(val.email);
      this.emailUnmet.set(emailResult.unmet);
    }
    const passResult = this.passValidation.validatePassword(val.password);
    this.passwordScore.set(passResult.extra.score);
    this.passwordColor.set(passResult.extra.color);
    this.passwordPercentage.set(passResult.extra.percentage);
    this.passwordUnmet.set(passResult.helper);
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.formSubmit.emit(this.signUpForm.value);
    }
  }
}
