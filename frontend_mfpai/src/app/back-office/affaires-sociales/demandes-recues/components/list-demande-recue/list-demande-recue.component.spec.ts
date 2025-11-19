import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDemandeRecueComponent } from './list-demande-recue.component';

describe('ListDemandeRecueComponent', () => {
  let component: ListDemandeRecueComponent;
  let fixture: ComponentFixture<ListDemandeRecueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDemandeRecueComponent]
    });
    fixture = TestBed.createComponent(ListDemandeRecueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
