import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTableauSuiviComponent } from './create-tableau-suivi.component';

describe('CreateTableauSuiviComponent', () => {
  let component: CreateTableauSuiviComponent;
  let fixture: ComponentFixture<CreateTableauSuiviComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTableauSuiviComponent]
    });
    fixture = TestBed.createComponent(CreateTableauSuiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
