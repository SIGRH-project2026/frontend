import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMutationComponent } from './create-mutation.component';

describe('CreateMutationComponent', () => {
  let component: CreateMutationComponent;
  let fixture: ComponentFixture<CreateMutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMutationComponent]
    });
    fixture = TestBed.createComponent(CreateMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
