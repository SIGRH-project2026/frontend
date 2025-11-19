import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThemeFormationComponent } from './create-theme-formation.component';

describe('CreateThemeFormationComponent', () => {
  let component: CreateThemeFormationComponent;
  let fixture: ComponentFixture<CreateThemeFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateThemeFormationComponent]
    });
    fixture = TestBed.createComponent(CreateThemeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
