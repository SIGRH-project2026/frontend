import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIefComponent } from './liste-ief.component';

describe('ListeIefComponent', () => {
  let component: ListeIefComponent;
  let fixture: ComponentFixture<ListeIefComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeIefComponent]
    });
    fixture = TestBed.createComponent(ListeIefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
