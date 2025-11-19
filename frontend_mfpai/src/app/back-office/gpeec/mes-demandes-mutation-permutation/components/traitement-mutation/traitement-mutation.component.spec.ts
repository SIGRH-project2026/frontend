import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementMutationComponent } from './traitement-mutation.component';

describe('TraitementMutationComponent', () => {
  let component: TraitementMutationComponent;
  let fixture: ComponentFixture<TraitementMutationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraitementMutationComponent]
    });
    fixture = TestBed.createComponent(TraitementMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
