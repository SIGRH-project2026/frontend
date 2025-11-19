import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleThemeFormationComponent } from './single-theme-formation.component';

describe('SingleThemeFormationComponent', () => {
  let component: SingleThemeFormationComponent;
  let fixture: ComponentFixture<SingleThemeFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleThemeFormationComponent]
    });
    fixture = TestBed.createComponent(SingleThemeFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
