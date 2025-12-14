import { TestBed } from '@angular/core/testing';

import { NameValidation } from './name-validation';

describe('NameValidation', () => {
  let service: NameValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NameValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
