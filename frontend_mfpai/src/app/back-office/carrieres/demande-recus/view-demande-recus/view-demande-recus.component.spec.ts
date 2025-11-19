import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDemandeRecusComponent } from './view-demande-recus.component';

describe('ViewDemandeRecusComponent', () => {
  let component: ViewDemandeRecusComponent;
  let fixture: ComponentFixture<ViewDemandeRecusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDemandeRecusComponent]
    });
    fixture = TestBed.createComponent(ViewDemandeRecusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
