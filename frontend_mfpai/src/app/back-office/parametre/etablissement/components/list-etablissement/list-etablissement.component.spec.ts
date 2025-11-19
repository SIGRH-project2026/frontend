import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEtablissementComponent } from './list-etablissement.component';

describe('ListEtablissementComponent', () => {
  let component: ListEtablissementComponent;
  let fixture: ComponentFixture<ListEtablissementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEtablissementComponent]
    });
    fixture = TestBed.createComponent(ListEtablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
