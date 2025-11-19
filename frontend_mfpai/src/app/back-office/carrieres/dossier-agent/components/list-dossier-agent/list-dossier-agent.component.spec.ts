import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDossierAgentComponent } from './list-dossier-agent.component';

describe('ListDossierAgentComponent', () => {
  let component: ListDossierAgentComponent;
  let fixture: ComponentFixture<ListDossierAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDossierAgentComponent]
    });
    fixture = TestBed.createComponent(ListDossierAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
