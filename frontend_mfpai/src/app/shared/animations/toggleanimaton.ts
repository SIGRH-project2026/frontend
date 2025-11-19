import {
    trigger,
    state,
    style,
    transition,
    animate,
    query,
    stagger
} from '@angular/animations';

export const toggleGradesAnimation = trigger('toggleGrades', [
    state('collapsed', style({
        height: '28px',
        opacity: 1,
        overflow: 'hidden'
    })),
    state('expanded', style({
        height: '*',
        opacity: 1
    })),
    transition('collapsed <=> expanded', animate('300ms ease-in-out'))
]);

export const toggleGradesAnimation22= trigger('toggleGrades', [
    state('collapsed', style({
        height: '28px',
        overflow: 'hidden'
    })),
    state('expanded', style({
        height: '*',
        overflow: 'hidden'
    })),
    transition('collapsed <=> expanded', [
        style({ overflow: 'hidden' }), // Ensure overflow is hidden
        animate('0.3s ease-in-out', style({ height: '*' }))
    ])
]);
