import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesMatiereDeficitsComponent } from './list-des-matiere-deficits.component';

describe('ListDesMatiereDeficitsComponent', () => {
  let component: ListDesMatiereDeficitsComponent;
  let fixture: ComponentFixture<ListDesMatiereDeficitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDesMatiereDeficitsComponent]
    });
    fixture = TestBed.createComponent(ListDesMatiereDeficitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
