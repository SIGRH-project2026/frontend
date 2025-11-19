import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFicheComponent } from './list-fiche.component';

describe('ListFicheComponent', () => {
  let component: ListFicheComponent;
  let fixture: ComponentFixture<ListFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFicheComponent]
    });
    fixture = TestBed.createComponent(ListFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
