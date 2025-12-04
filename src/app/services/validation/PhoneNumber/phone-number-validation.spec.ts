import { TestBed } from '@angular/core/testing';

import { PhoneNumberValidation } from './phone-number-validation';

describe('PhoneNumberValidation', () => {
  let service: PhoneNumberValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneNumberValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
