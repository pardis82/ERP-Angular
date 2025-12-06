import { TestBed } from '@angular/core/testing';

import { NormalizeDigitsDirective } from './normalize-digits';

describe('NationalCodeValidationService', () => {
  let service: NormalizeDigitsDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(NormalizeDigitsDirective);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
