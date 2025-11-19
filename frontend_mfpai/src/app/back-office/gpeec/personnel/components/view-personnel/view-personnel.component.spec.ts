import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPersonnelComponent } from './view-personnel.component';

describe('ViewPersonnelComponent', () => {
  let component: ViewPersonnelComponent;
  let fixture: ComponentFixture<ViewPersonnelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPersonnelComponent]
    });
    fixture = TestBed.createComponent(ViewPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
