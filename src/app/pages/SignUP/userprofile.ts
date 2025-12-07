import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Option, SelectField } from '../../components/select-field/select-field';
import { UserNameValidationService } from '../../services/validation/UserName/user-name-validation';
import { PasswordValidationService } from '../../services/validation/Password/password-validation';
import { PhoneNumberValidationService } from '../../services/validation/PhoneNumber/phone-number-validation';
import { NationalCodeValidationService } from '../../services/validation/NationalCode/national-code-validation';
import { CompNationalCodeValidationService } from '../../services/validation/CompNationalCode/comp-national-code-validation';
import { legalPersonForm } from './legalPersonSignUp';
import { naturalPersonForm } from './naturalPersonSignUp';
@Component({
  selector: 'app-user-profile-form',
  imports: [SelectField, ReactiveFormsModule, legalPersonForm, naturalPersonForm, CommonModule],
  templateUrl: './userprofile.html',
})
export class UserProfile implements OnInit {
  private fb = inject(FormBuilder);
  private passvalidation = inject(PasswordValidationService);
  private usernvalidation = inject(UserNameValidationService);
  private nationalcodevalidation = inject(NationalCodeValidationService);
  private phonevalidation = inject(PhoneNumberValidationService);
  private compnationalcodevalidation = inject(CompNationalCodeValidationService);
  userProfileForm!: FormGroup;
  formValid = signal(false);
  selectedUserType = signal<number | null>(null);
  public UserTypeOptions: Option[] = [
    {
      value: 1,
      label: 'حقیقی',
    },
    {
      value: 2,
      label: 'حقوقی',
    },
  ];

  // Create signals for form values to trigger computed updates
  formValues = signal({
    username: '',
    password: '',
    nationalcode: '',
    compnationalcode: '',
    phonenumber: '',
  });

  constructor() {}

  ngOnInit() {
    this.userProfileForm = this.fb.group({
      userType: [this.UserTypeOptions[0].value, [Validators.required]],
    });
    this.selectedUserType.set(this.userProfileForm.get('userType')?.value);
    // Listen to form value changes and update the signal
    this.userProfileForm.valueChanges.subscribe((values) => {
      const rawUserType = values.userType;
      const userType: number | null =
        typeof rawUserType === 'object' && rawUserType !== null && 'value' in rawUserType
          ? (rawUserType.value as number) // Extract the number from the Option object
          : (rawUserType as number | null); // Use the number directly

      this.selectedUserType.set(userType);

      this.selectedUserType.set(userType);
      const getControlValue = (name: string): string => {
        const control = this.userProfileForm.get(name);
        // If the control exists AND it has a value, return it, otherwise return empty string
        return control && control.value !== null ? String(control.value) : '';
      };

      const nationalCodeValue = getControlValue('nationalcode');
      const compNationalCodeValue = getControlValue('compnationalcode');
      this.formValues.set({
        username: values.username || '',
        password: values.password || '',
        phonenumber: values.phonenumber || '',
        nationalcode: userType === 1 ? nationalCodeValue : '',
        compnationalcode: userType === 2 ? compNationalCodeValue : '',
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

  nationalCodeValidation = computed(() =>
    this.nationalcodevalidation.validateNationalCode(this.formValues().nationalcode)
  );
  compNationalCodeValidation = computed(() =>
    this.compnationalcodevalidation.validateCompNationalCode(this.formValues().compnationalcode)
  );
  phonenumberValidation = computed(() =>
    this.phonevalidation.validatePhoneNumber(this.formValues().phonenumber)
  );

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);
  nationalUnmetRules = computed(() => this.nationalCodeValidation().unmet);
  compnationalUnmetRules = computed(() => this.compNationalCodeValidation().unmet);
  phoneUnmetRules = computed(() => this.phonenumberValidation().unmet);
}
