import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[phoneMask]'
})
export class PhoneMaskDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 7) {
      formatted = `(${cleaned.slice(0, 2)})${cleaned.slice(2)}`;
    } else {
      formatted = `(${cleaned.slice(0, 2)})${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }

    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}