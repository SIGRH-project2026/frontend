import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormationDiplomanteComponent } from './create-formation-diplomante.component';

describe('CreateFormationDiplomanteComponent', () => {
  let component: CreateFormationDiplomanteComponent;
  let fixture: ComponentFixture<CreateFormationDiplomanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFormationDiplomanteComponent]
    });
    fixture = TestBed.createComponent(CreateFormationDiplomanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
