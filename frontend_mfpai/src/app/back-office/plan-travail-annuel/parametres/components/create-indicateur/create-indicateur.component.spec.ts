import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndicateurComponent } from './create-indicateur.component';

describe('CreateIndicateurComponent', () => {
  let component: CreateIndicateurComponent;
  let fixture: ComponentFixture<CreateIndicateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIndicateurComponent]
    });
    fixture = TestBed.createComponent(CreateIndicateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
