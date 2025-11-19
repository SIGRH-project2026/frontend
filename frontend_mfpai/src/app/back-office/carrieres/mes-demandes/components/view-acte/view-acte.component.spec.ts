import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActeComponent } from './view-acte.component';

describe('ViewActeComponent', () => {
  let component: ViewActeComponent;
  let fixture: ComponentFixture<ViewActeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewActeComponent]
    });
    fixture = TestBed.createComponent(ViewActeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
