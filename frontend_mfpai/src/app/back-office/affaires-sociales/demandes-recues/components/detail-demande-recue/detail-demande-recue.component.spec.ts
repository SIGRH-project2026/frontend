import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDemandeRecueComponent } from './detail-demande-recue.component';

describe('DetailDemandeRecueComponent', () => {
  let component: DetailDemandeRecueComponent;
  let fixture: ComponentFixture<DetailDemandeRecueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailDemandeRecueComponent]
    });
    fixture = TestBed.createComponent(DetailDemandeRecueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
