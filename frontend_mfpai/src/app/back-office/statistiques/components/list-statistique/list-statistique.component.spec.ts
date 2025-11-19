import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStatistiqueComponent } from './list-statistique.component';

describe('ListStatistiqueComponent', () => {
  let component: ListStatistiqueComponent;
  let fixture: ComponentFixture<ListStatistiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListStatistiqueComponent]
    });
    fixture = TestBed.createComponent(ListStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
