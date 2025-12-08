import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextField } from '../../../components/text-field/text-field';
import { PasswordValidationService } from '../../../services/validation/Password/password-validation';
import { UserNameValidationService } from '../../../services/validation/UserName/user-name-validation';
import { NationalCodeValidationService } from '../../../services/validation/NationalCode/national-code-validation';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './sign-up-form.html',
})
export class SignUpForm {
  private fb = inject(FormBuilder);
  // Inject validation services if they exist
  private passValidation = inject(PasswordValidationService); 
  private userValidation = inject(UserNameValidationService);
  private nationalCodeValidation= inject(NationalCodeValidationService)

  public formSubmit = output<any>();
  signUpForm: FormGroup;

  // Signals for real-time validation feedback
  public passwordScore = signal(0);
  public passwordColor= signal('');
  public passwordPercentage= signal(0);
  public passwordUnmet = signal<string[]>([]);
  public usernameUnmet = signal<string[]>([]);
  public nationalCodeUnmet = signal<string[]>([])

  constructor() {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      nationalCode: ['', [Validators.required]], 
      password: ['', [Validators.required,]],
    });

    // Listen to changes to update validation signals
    this.signUpForm.valueChanges.subscribe(val => {
        this.updateValidationSignals(val);
    });
  }

  updateValidationSignals(val: any) {
    // 1. Validate Password using your service
    if (val.password) {
        const passResult = this.passValidation.validatePassword(val.password);
        this.passwordScore.set(passResult.extra.score);
        this.passwordColor.set(passResult.extra.color);
        this.passwordPercentage.set(passResult.extra.percentage)
        this.passwordUnmet.set(passResult.helper);
    }

    // 2. Validate Username
    if (val.username) {
        const userResult = this.userValidation.validateUsername(val.username);
        this.usernameUnmet.set(userResult.unmet);
    }

    if(val.nationalCode){
      const nationalCodeResult= this.nationalCodeValidation.validateNationalCode(val.nationalCode);
      this.nationalCodeUnmet.set(nationalCodeResult.unmet)
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.formSubmit.emit(this.signUpForm.value);
    }
  }
}
