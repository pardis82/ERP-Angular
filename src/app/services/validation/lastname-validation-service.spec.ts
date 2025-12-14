import { TestBed } from '@angular/core/testing';

import {LastNameVAlidationService} from './lastname-validation-service'

describe('LastNameVAlidationService', () => {
  let service: LastNameVAlidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastNameVAlidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
