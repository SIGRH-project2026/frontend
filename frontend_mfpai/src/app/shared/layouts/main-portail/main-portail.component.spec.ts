import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPortailComponent } from './main-portail.component';

describe('MainPortailComponent', () => {
  let component: MainPortailComponent;
  let fixture: ComponentFixture<MainPortailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPortailComponent]
    });
    fixture = TestBed.createComponent(MainPortailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
