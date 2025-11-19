import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesAgentComponent } from './liste-des-agent.component';

describe('ListeDesAgentComponent', () => {
  let component: ListeDesAgentComponent;
  let fixture: ComponentFixture<ListeDesAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDesAgentComponent]
    });
    fixture = TestBed.createComponent(ListeDesAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
