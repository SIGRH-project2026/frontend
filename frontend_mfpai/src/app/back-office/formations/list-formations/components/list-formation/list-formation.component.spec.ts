import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormationComponent } from './list-formation.component';

describe('ListFormationComponent', () => {
  let component: ListFormationComponent;
  let fixture: ComponentFixture<ListFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFormationComponent]
    });
    fixture = TestBed.createComponent(ListFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
