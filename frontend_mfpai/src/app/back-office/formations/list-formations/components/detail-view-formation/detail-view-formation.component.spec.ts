import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewFormationComponent } from './detail-view-formation.component';

describe('DetailViewFormationComponent', () => {
  let component: DetailViewFormationComponent;
  let fixture: ComponentFixture<DetailViewFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewFormationComponent]
    });
    fixture = TestBed.createComponent(DetailViewFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
