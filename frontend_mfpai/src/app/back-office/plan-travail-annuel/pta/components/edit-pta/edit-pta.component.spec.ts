import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPtaComponent } from './edit-pta.component';

describe('EditPtaComponent', () => {
  let component: EditPtaComponent;
  let fixture: ComponentFixture<EditPtaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPtaComponent]
    });
    fixture = TestBed.createComponent(EditPtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
