import { TemplateRef, ViewContainerRef } from '@angular/core';
import { CanProcessDirective } from './can-process.directive';

describe('CanProcessDirective', () => {
  it('should create an instance', () => {
    const templateRef = {} as TemplateRef<any>;
    const viewContainer = {} as ViewContainerRef;
    const directive = new CanProcessDirective(templateRef, viewContainer);
    expect(directive).toBeTruthy();
  });
});
