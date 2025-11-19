import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActualiteComponent } from './list-actualite.component';

describe('ListActualiteComponent', () => {
  let component: ListActualiteComponent;
  let fixture: ComponentFixture<ListActualiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListActualiteComponent]
    });
    fixture = TestBed.createComponent(ListActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
