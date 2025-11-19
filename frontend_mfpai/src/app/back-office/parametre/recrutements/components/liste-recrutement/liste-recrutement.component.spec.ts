import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRecrutementComponent } from './liste-recrutement.component';

describe('ListeRecrutementComponent', () => {
  let component: ListeRecrutementComponent;
  let fixture: ComponentFixture<ListeRecrutementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeRecrutementComponent]
    });
    fixture = TestBed.createComponent(ListeRecrutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
