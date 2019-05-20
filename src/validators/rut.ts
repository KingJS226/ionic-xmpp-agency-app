import { FormControl } from '@angular/forms';

export class RutValidator {
  
  static isValid(control: FormControl){
    const re = /^([0-9]{7,8})-([a-zA-Z0-9_\-\.]{1})$/.test(control.value);
    
    if (re){
      return null;
    }
    
    return {
      "invalidRut": true
    };
    
  }
}