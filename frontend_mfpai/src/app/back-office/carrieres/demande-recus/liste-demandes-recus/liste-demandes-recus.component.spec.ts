import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDemandesRecusComponent } from './liste-demandes-recus.component';

describe('ListeDemandesRecusComponent', () => {
  let component: ListeDemandesRecusComponent;
  let fixture: ComponentFixture<ListeDemandesRecusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDemandesRecusComponent]
    });
    fixture = TestBed.createComponent(ListeDemandesRecusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
