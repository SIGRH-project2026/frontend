import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSpecialiteComponent } from './liste-specialite.component';

describe('ListeSpecialiteComponent', () => {
  let component: ListeSpecialiteComponent;
  let fixture: ComponentFixture<ListeSpecialiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeSpecialiteComponent]
    });
    fixture = TestBed.createComponent(ListeSpecialiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
