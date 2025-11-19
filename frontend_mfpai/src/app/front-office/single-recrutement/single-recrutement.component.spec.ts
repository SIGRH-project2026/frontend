import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRecrutementComponent } from './single-recrutement.component';

describe('SingleRecrutementComponent', () => {
  let component: SingleRecrutementComponent;
  let fixture: ComponentFixture<SingleRecrutementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleRecrutementComponent]
    });
    fixture = TestBed.createComponent(SingleRecrutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
