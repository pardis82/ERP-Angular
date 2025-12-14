import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextField } from '../../../components/text-field/text-field';
import { PasswordValidationService } from '../../../services/validation/pass-validation';
import { EmailValidationService } from '../../../services/validation/email-validation';
import { NationalCodeValidationService } from '../../../services/validation/national-code-validation';
import { NameValidationService } from '../../../services/validation/name-validation';
import { LastNameValidationService } from '../../../services/validation/lastname-validation-service';
import { SelectField, Option } from '../../../components/select-field/select-field';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [TextField, ReactiveFormsModule, SelectField],
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
  public legalPersoncompnameUnmet = signal<string[]>([]);
  public legalPersonregisterynumberUnmet = signal<string[]>([]);
  public legalPersonNationalidUnmet = signal<string[]>([]);
  public legalPersonEconomicCodeUnmet = signal<string[]>([]);
  public postalCodeUnmet = signal<string[]>([]);
  public realPersonnameUnmet = signal<string[]>([]);
  public realPersonNationalcodeUnmet = signal<string[]>([]);
  public realpersonEconomicCodeUnmet = signal<string[]>([]);
  public partnershipNameUnmet = signal<string[]>([]);
  public partnershipEconomicCodeUnmet = signal<string[]>([]);

  public customerTypes: Option[] = [
    {
      value: 'real',
      label: 'حقیقی',
    },
    {
      value: 'legal',
      label: 'حقوقی',
    },
    {
      value: 'partnership',
      label: 'مشارکت مدنی',
    },
  ];

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      nationalCode: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rulesAccepted: [false, [Validators.requiredTrue]],
      isRepresentative: [false],
      representativeType: [null],
      legalPersoncompname: [''],
      legalPersonregisterynumber: [''],
      legalPersonNationalid: [''],
      legalPersonEconomicCode: [''],
      postalCode: [''],
      realPersonname: [''],
      realPersonNationalcode: [''],
      realpersonEconomicCode: [''],
      partnershipName: [''],
      partnershipEconomicCode: [''],
    });
    this.updateValidationSignals(this.signUpForm.value);
    this.signUpForm.get('isRepresentative')?.valueChanges.subscribe((isChecked) => {
      if (!isChecked) {
        this.signUpForm.get('representativeType')?.setValue(null);
        this.signUpForm.get('representativeType')?.clearValidators();
        this.clearDynamicFields();
      } else {
        this.signUpForm.get('representativeType')?.setValidators([Validators.required]);
      }
      this.signUpForm.get('representativeType')?.updateValueAndValidity();
    });
    this.signUpForm.get('representativeType')?.valueChanges.subscribe((selection) => {
      const representativeValue = selection?.value;
      // this.handleRepTypeChange(representativeValue);
    });
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

  clearDynamicFields() {
    const allDynamicFileds = [
      'legalPersoncompname',
      'legalPersonregisterynumber',
      'legalPersonNationalid',
      'legalPersonEconomicCode',
      'postalCode',
      'realPersonname',
      'realPersonNationalcode',
      'realpersonEconomicCode',
      'partnershipName',
      'partnershipEconomicCode',
    ];
    allDynamicFileds.forEach((field) => {
      const control = this.signUpForm.get(field);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }

  setRequired(fields: string[]) {
    fields.forEach((field) => {
      const control = this.signUpForm.get(field);
      control?.setValidators([Validators.required]);
      control?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.formSubmit.emit(this.signUpForm.value);
    }
  }
}
