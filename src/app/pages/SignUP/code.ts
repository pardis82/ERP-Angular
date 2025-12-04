import { Component } from '@angular/core';
import { VerificationCode } from '../../components/verification-code/verification-code';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule for ngIf

@Component({
  selector: 'code-page',
  // Add CommonModule to imports to use *ngIf
  imports: [VerificationCode, CommonModule],
  template: `
    <div dir="ltr" class="flex justify-center">
      <ng-container *ngIf="!isLoading">
        <app-verification-code
          [boxNumber]="5"
          [maxLength]="3"
          [verificationCode]="'123456789101112'"
          (verificationComplete)="handleVerification($event)"
        ></app-verification-code>
      </ng-container>

      <div *ngIf="isLoading" class="p-8 text-center text-lg font-semibold text-blue-600">
        Verification Successful! Redirecting...
        <div
          class="mt-4 animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
        ></div>
      </div>
    </div>
  `,
})
export class CodePage {
  // New property to control the loading state
  isLoading: boolean = false;

  constructor(private router: Router) {}

  handleVerification(result: { success: boolean; code: string }): void {
    if (result.success) {
      setTimeout(() => {
        this.isLoading = true;
      }, 700);
      // 1. Set loading state to true immediately upon success

      setTimeout(() => {
        // 2. After the delay, navigate
        this.router.navigate(['/UserProfile']);
      }, 2000);
    }
  }
}
