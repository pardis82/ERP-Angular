import { TestBed } from '@angular/core/testing';


import { CompNationalCodeValidationService } from './comp-national-code-validation';

describe('CompNationalCodeValidationService', () => {
let service: CompNationalCodeValidationService;
 beforeEach(() => {
 TestBed.configureTestingModule({});

service = TestBed.inject(CompNationalCodeValidationService); });
 it('should be created', () => {
 expect(service).toBeTruthy();
});
});