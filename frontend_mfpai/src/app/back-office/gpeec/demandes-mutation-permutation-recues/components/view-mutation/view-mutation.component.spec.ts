import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMutationComponent } from '../../../demande-mutation-permutation-recue/components/view-mutation/view-mutation.component';

describe('ViewMutationComponent', () => {
  let component: ViewMutationComponent;
  let fixture: ComponentFixture<ViewMutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMutationComponent]
    });
    fixture = TestBed.createComponent(ViewMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
