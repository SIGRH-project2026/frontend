import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorisationStageComponent } from './autorisation-stage.component';

describe('AutorisationStageComponent', () => {
  let component: AutorisationStageComponent;
  let fixture: ComponentFixture<AutorisationStageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutorisationStageComponent]
    });
    fixture = TestBed.createComponent(AutorisationStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
