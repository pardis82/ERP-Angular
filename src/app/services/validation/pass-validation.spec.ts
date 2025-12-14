import { TestBed } from '@angular/core/testing';

import { PassValidationService } from './pass-validation';

describe('NationalCodeValidationService', () => {
  let service: PassValidationService;
  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(PassValidationService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});