import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPermutationComponent } from './list-permutation.component';

describe('ListPermutationComponent', () => {
  let component: ListPermutationComponent;
  let fixture: ComponentFixture<ListPermutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPermutationComponent]
    });
    fixture = TestBed.createComponent(ListPermutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
