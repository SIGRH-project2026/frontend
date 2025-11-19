import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorpsGradeComponent } from './add-corps-grade.component';

describe('AddCorpsGradeComponent', () => {
  let component: AddCorpsGradeComponent;
  let fixture: ComponentFixture<AddCorpsGradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCorpsGradeComponent]
    });
    fixture = TestBed.createComponent(AddCorpsGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
