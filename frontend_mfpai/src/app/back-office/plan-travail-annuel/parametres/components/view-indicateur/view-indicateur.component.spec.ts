import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndicateurComponent } from './view-indicateur.component';

describe('ViewIndicateurComponent', () => {
  let component: ViewIndicateurComponent;
  let fixture: ComponentFixture<ViewIndicateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewIndicateurComponent]
    });
    fixture = TestBed.createComponent(ViewIndicateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
