import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPortailComponent } from './footer-portail.component';

describe('FooterPortailComponent', () => {
  let component: FooterPortailComponent;
  let fixture: ComponentFixture<FooterPortailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterPortailComponent]
    });
    fixture = TestBed.createComponent(FooterPortailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
