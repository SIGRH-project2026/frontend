import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUtilisateurComponent } from './create-utilisateur.component';

describe('CreateUtilisateurComponent', () => {
  let component: CreateUtilisateurComponent;
  let fixture: ComponentFixture<CreateUtilisateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUtilisateurComponent]
    });
    fixture = TestBed.createComponent(CreateUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
