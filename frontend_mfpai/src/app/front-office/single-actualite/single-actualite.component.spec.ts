import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleActualiteComponent } from './single-actualite.component';

describe('SingleActualiteComponent', () => {
  let component: SingleActualiteComponent;
  let fixture: ComponentFixture<SingleActualiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleActualiteComponent]
    });
    fixture = TestBed.createComponent(SingleActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
