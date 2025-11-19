import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesBesoinsRecusComponent } from './liste-des-besoins-recus.component';

describe('ListeDesBesoinsRecusComponent', () => {
  let component: ListeDesBesoinsRecusComponent;
  let fixture: ComponentFixture<ListeDesBesoinsRecusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDesBesoinsRecusComponent]
    });
    fixture = TestBed.createComponent(ListeDesBesoinsRecusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
