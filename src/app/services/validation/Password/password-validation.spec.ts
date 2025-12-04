import { TestBed } from '@angular/core/testing';

import { PasswordValidation } from './password-validation';

describe('PasswordValidation', () => {
  let service: PasswordValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
