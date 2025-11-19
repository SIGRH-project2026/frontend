import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThemeFormationComponent } from './edit-theme-formation.component';

describe('EditThemeFormationComponent', () => {
  let component: EditThemeFormationComponent;
  let fixture: ComponentFixture<EditThemeFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditThemeFormationComponent]
    });
    fixture = TestBed.createComponent(EditThemeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
