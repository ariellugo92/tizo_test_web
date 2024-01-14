import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent implements ControlValueAccessor {

  @Input() title?: string;
  @Input({required: true}) type!: 'text' | 'password' | 'textarea' | 'number';
  @Input() hasValidation: boolean = false;
  @Input() placeholder?: string;
  @Input() isRequired?: boolean;

  value: any = null;
  disabled?: boolean;
  onChange = (_: any) => { };
  onTouch = () => { };

  onInput(value: any) {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
