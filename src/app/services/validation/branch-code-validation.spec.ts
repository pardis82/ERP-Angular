import { TestBed } from '@angular/core/testing';

import { BranchCodeValidationService } from './branch-code-validation';

describe('BranchCodeValidation', () => {
  let service: BranchCodeValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchCodeValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
