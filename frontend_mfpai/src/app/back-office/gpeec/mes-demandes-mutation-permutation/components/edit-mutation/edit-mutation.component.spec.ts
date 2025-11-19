import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMutationComponent } from './edit-mutation.component';

describe('EditMutationComponent', () => {
  let component: EditMutationComponent;
  let fixture: ComponentFixture<EditMutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMutationComponent]
    });
    fixture = TestBed.createComponent(EditMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
