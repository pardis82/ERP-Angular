import { Component, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextField } from '../../components/text-field/text-field';
import { UserNameValidationService } from '../../services/validation/UserName/user-name-validation';
import { PasswordValidationService } from '../../services/validation/Password/password-validation';
import { PhoneNumberValidationService } from '../../services/validation/PhoneNumber/phone-number-validation';
import { NationalCodeValidationService } from '../../services/validation/NationalCode/national-code-validation';
@Component({
  selector: 'app-user-profile-form',
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './userprofile.html',
})
export class UserProfile implements OnInit {
  userProfileForm!: FormGroup;
  formValid = signal(false);

  // Create signals for form values to trigger computed updates
  formValues = signal({
    username: '',
    password: '',
    nationalcode: '',
    phonenumber: '',
  });

  constructor(
    private fb: FormBuilder,
    private passvalidation: PasswordValidationService,
    private usernvalidation: UserNameValidationService,
    private nationalcodevalidation: NationalCodeValidationService,
    private phonevalidation: PhoneNumberValidationService
  ) {}

  ngOnInit() {
    this.userProfileForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      nationalcode: ['', [Validators.required]],
      phonenumber: ['', [Validators.required]],
    });

    // Listen to form value changes and update the signal
    this.userProfileForm.valueChanges.subscribe((values) => {
      this.formValues.set({
        username: values.username || '',
        password: values.password || '',
        nationalcode: values.nationalcode || '',
        phonenumber: values.phonenumber || '',
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
  phonenumberValidation = computed(() =>
    this.phonevalidation.validatePhoneNumber(this.formValues().phonenumber)
  );
  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);
  nationalUnmetRules = computed(() => this.nationalCodeValidation().unmet);
  phoneUnmetRules = computed(() => this.phonenumberValidation().unmet);
}
