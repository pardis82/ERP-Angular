import { TestBed } from '@angular/core/testing';

import {NationalCodeValidationService} from './national-code-validation'

describe('NationalCodeValidationService', () => {
  let service: NationalCodeValidationService;
  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(NationalCodeValidationService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});