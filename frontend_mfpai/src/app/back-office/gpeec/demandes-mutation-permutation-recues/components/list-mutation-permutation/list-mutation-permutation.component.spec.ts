import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMutationPermutationComponent } from './list-mutation-permutation.component';

describe('ListMutationPermutationComponent', () => {
  let component: ListMutationPermutationComponent;
  let fixture: ComponentFixture<ListMutationPermutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListMutationPermutationComponent]
    });
    fixture = TestBed.createComponent(ListMutationPermutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
