import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCorpsGradeComponent } from './list-corps-grade.component';

describe('ListCorpsGradeComponent', () => {
  let component: ListCorpsGradeComponent;
  let fixture: ComponentFixture<ListCorpsGradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCorpsGradeComponent]
    });
    fixture = TestBed.createComponent(ListCorpsGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
