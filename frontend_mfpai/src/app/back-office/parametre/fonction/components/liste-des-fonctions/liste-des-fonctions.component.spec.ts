import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesFonctionsComponent } from './liste-des-fonctions.component';

describe('ListeDesFonctionsComponent', () => {
  let component: ListeDesFonctionsComponent;
  let fixture: ComponentFixture<ListeDesFonctionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDesFonctionsComponent]
    });
    fixture = TestBed.createComponent(ListeDesFonctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
