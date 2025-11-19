import { AbstractControl, ValidationErrors } from '@angular/forms';

export function thirteenOrFourteenDigitsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
        return null;
    }

    const isValid = /^\d{13}$/.test(value) ||
        /^\d{14}$/.test(value) ||
        /^[a-zA-Z0-9]{13}$/.test(value) ||
        /^[a-zA-Z0-9]{14}$/.test(value);

    return isValid ? null : { invalidLength: true };
}



export function matriculeFonctionnaireValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value === undefined || value === 'undefined' ) {
        return null;
    }

    if (!value) {
        return null;
    }

   // const isValid = /^\d{6}\/[A-Z]$/.test(value);
    const isValid = /^\d{6}$/.test(value) || /^\d{6}\/[A-Z]$/.test(value);

    return isValid ? null : { invalidMatriculeFonctionnaire: true };
}

export function matriculeContractuelValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value === undefined || value === 'undefined' ) {
        return null;
    }
    if (!value) {
        return null;
    }

    //const isValid = /^\d{9}\/[A-Z]$/.test(value);
    const isValid = /^\d{9}$/.test(value) || /^\d{9}\/[A-Z]$/.test(value);

    return isValid ? null : { invalidMatriculeContractuel: true };
}
