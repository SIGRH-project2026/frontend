import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMesFormationsComponent } from './list-mes-formations.component';

describe('ListMesFormationsComponent', () => {
  let component: ListMesFormationsComponent;
  let fixture: ComponentFixture<ListMesFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListMesFormationsComponent]
    });
    fixture = TestBed.createComponent(ListMesFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
