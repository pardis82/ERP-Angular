import { TestBed } from '@angular/core/testing';

import { CompNationalCodeValidation } from './comp-national-code-validation';

describe('CompNationalCodeValidation', () => {
  let service: CompNationalCodeValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompNationalCodeValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
