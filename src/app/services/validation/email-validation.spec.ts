import { TestBed } from '@angular/core/testing';

import { EmailValidation } from './email-validation';

describe('EmailValidation', () => {
  let service: EmailValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
