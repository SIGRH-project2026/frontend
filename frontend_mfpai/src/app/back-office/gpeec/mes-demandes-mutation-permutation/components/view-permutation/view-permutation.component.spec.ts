import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPermutationComponent } from './view-permutation.component';

describe('ViewPermutationComponent', () => {
  let component: ViewPermutationComponent;
  let fixture: ComponentFixture<ViewPermutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPermutationComponent]
    });
    fixture = TestBed.createComponent(ViewPermutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
