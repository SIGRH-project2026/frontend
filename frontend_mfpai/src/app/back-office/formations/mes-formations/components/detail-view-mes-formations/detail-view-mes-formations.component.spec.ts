import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewMesFormationsComponent } from './detail-view-mes-formations.component';

describe('DetailViewMesFormationsComponent', () => {
  let component: DetailViewMesFormationsComponent;
  let fixture: ComponentFixture<DetailViewMesFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewMesFormationsComponent]
    });
    fixture = TestBed.createComponent(DetailViewMesFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
