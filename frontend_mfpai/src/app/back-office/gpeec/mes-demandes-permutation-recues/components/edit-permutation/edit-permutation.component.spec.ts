import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPermutationComponent } from '../../../demande-mutation-permutation-recue/components/edit-permutation/edit-permutation.component';

describe('EditPermutationComponent', () => {
  let component: EditPermutationComponent;
  let fixture: ComponentFixture<EditPermutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPermutationComponent]
    });
    fixture = TestBed.createComponent(EditPermutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
