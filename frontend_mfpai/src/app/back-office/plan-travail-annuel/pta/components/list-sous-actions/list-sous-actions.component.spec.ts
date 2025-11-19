import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSousActionsComponent } from './list-sous-actions.component';

describe('ListSousActionsComponent', () => {
  let component: ListSousActionsComponent;
  let fixture: ComponentFixture<ListSousActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSousActionsComponent]
    });
    fixture = TestBed.createComponent(ListSousActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
