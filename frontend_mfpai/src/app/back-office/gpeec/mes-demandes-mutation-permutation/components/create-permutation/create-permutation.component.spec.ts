import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePermutationComponent } from './create-permutation.component';

describe('CreatePermutationComponent', () => {
  let component: CreatePermutationComponent;
  let fixture: ComponentFixture<CreatePermutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePermutationComponent]
    });
    fixture = TestBed.createComponent(CreatePermutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
