import { TestBed } from '@angular/core/testing';

import { UserNameValidation } from './user-name-validation';

describe('UserNameValidation', () => {
  let service: UserNameValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNameValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
