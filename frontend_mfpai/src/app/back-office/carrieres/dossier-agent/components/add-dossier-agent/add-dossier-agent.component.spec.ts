import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDossierAgentComponent } from './add-dossier-agent.component';

describe('AddDossierAgentComponent', () => {
  let component: AddDossierAgentComponent;
  let fixture: ComponentFixture<AddDossierAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDossierAgentComponent]
    });
    fixture = TestBed.createComponent(AddDossierAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
