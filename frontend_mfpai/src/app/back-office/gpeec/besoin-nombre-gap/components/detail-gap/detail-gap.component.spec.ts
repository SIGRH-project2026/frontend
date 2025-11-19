import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGapComponent } from './detail-gap.component';

describe('DetailGapComponent', () => {
  let component: DetailGapComponent;
  let fixture: ComponentFixture<DetailGapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailGapComponent]
    });
    fixture = TestBed.createComponent(DetailGapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
