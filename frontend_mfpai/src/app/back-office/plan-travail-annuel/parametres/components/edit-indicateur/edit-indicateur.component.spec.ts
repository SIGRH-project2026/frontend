import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIndicateurComponent } from './edit-indicateur.component';

describe('EditIndicateurComponent', () => {
  let component: EditIndicateurComponent;
  let fixture: ComponentFixture<EditIndicateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditIndicateurComponent]
    });
    fixture = TestBed.createComponent(EditIndicateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
