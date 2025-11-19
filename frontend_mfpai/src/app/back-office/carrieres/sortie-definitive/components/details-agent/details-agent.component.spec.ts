import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAgentComponent } from './details-agent.component';

describe('DetailsAgentComponent', () => {
  let component: DetailsAgentComponent;
  let fixture: ComponentFixture<DetailsAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsAgentComponent]
    });
    fixture = TestBed.createComponent(DetailsAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
