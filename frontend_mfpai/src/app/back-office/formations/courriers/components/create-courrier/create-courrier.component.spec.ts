import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourrierComponent } from './create-courrier.component';

describe('CreateCourrierComponent', () => {
  let component: CreateCourrierComponent;
  let fixture: ComponentFixture<CreateCourrierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCourrierComponent]
    });
    fixture = TestBed.createComponent(CreateCourrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
