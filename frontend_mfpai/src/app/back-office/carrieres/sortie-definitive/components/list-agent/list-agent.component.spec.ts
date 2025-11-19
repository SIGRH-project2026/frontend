import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgentComponent } from './list-agent.component';

describe('ListAgentComponent', () => {
  let component: ListAgentComponent;
  let fixture: ComponentFixture<ListAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAgentComponent]
    });
    fixture = TestBed.createComponent(ListAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
