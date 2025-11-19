import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleStatistiqueComponent } from './single-statistique.component';

describe('SingleStatistiqueComponent', () => {
  let component: SingleStatistiqueComponent;
  let fixture: ComponentFixture<SingleStatistiqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleStatistiqueComponent]
    });
    fixture = TestBed.createComponent(SingleStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
