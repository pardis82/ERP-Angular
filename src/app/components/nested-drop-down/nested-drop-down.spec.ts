import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedDropDown } from './nested-drop-down';

describe('NestedDropDown', () => {
  let component: NestedDropDown;
  let fixture: ComponentFixture<NestedDropDown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedDropDown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedDropDown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
