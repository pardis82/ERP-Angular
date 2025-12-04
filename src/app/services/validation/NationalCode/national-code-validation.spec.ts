import { TestBed } from '@angular/core/testing';

import { NationalCodeValidation } from './national-code-validation';

describe('NationalCodeValidation', () => {
  let service: NationalCodeValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NationalCodeValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
