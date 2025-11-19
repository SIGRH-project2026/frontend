import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIndicateurComponent } from './list-indicateur.component';

describe('ListIndicateurComponent', () => {
  let component: ListIndicateurComponent;
  let fixture: ComponentFixture<ListIndicateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListIndicateurComponent]
    });
    fixture = TestBed.createComponent(ListIndicateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
