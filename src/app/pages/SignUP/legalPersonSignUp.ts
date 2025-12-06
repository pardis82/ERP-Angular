import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextField } from '../../components/text-field/text-field';

@Component({
  selector: 'app-legal-person-form',
  imports: [TextField, ReactiveFormsModule, CommonModule],
  templateUrl: './legalProfile.html',
})
export class legalPersonForm implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  @Input() compnationalUnmetRules: string[] = [];
  @Input() usernameUnmetRules: string[] = [];
  @Input() phoneUnmetRules: string[] = [];
  @Input() passwordUnmetRules: string[] = [];
  @Input() passwordScore: number = 0;
  @Input() passwordPercentage: number = 0;
  @Input() passwordColor: string = '';

  ngOnInit(): void {
    this.parentForm.addControl('compnationalcode', new FormControl('', Validators.required));
    this.parentForm.addControl('username', new FormControl('', Validators.required));
    this.parentForm.addControl('password', new FormControl('', Validators.required));
    this.parentForm.addControl('phonenumber', new FormControl('', Validators.required));
  }
  ngOnDestroy(): void {
    this.parentForm.removeControl('compnationalcode');
    this.parentForm.removeControl('username');
    this.parentForm.removeControl('password');
    this.parentForm.removeControl('phonenumber');
  }
}
