import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecrutementComponent } from './recrutement.component';

describe('RecrutementComponent', () => {
  let component: RecrutementComponent;
  let fixture: ComponentFixture<RecrutementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecrutementComponent]
    });
    fixture = TestBed.createComponent(RecrutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
