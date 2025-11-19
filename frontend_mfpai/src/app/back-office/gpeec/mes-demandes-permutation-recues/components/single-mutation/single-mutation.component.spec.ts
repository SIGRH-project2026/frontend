import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMutationComponent } from '../../../demande-mutation-permutation-recue/components/single-mutation/single-mutation.component';

describe('SingleMutationComponent', () => {
  let component: SingleMutationComponent;
  let fixture: ComponentFixture<SingleMutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleMutationComponent]
    });
    fixture = TestBed.createComponent(SingleMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
