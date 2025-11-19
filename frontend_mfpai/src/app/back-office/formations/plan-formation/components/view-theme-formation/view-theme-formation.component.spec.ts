import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewThemeFormationComponent } from './view-theme-formation.component';

describe('ViewThemeFormationComponent', () => {
  let component: ViewThemeFormationComponent;
  let fixture: ComponentFixture<ViewThemeFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewThemeFormationComponent]
    });
    fixture = TestBed.createComponent(ViewThemeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
