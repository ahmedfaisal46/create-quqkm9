import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TestComponent),
  multi: true,
};

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements ControlValueAccessor {
  public _options: Array<Option> = [];
  public selectedOptions: Array<Option> = [];
  public isOpen = false;
  private _sourceDataType = null;
  private _sourceDataFields: Array<String> = [];

  @Input()
  placeholder: string = 'Select';

  @Input()
  optionTemplate: TemplateRef<any>;

  @Input()
  public set options(value: Array<any>) {
    if (!value) {
      this._options = [];
    } else {
      const firstOption = value[0];
      this._sourceDataType = typeof firstOption;
      this._sourceDataFields = this.getFields(firstOption);
      this._options = value.map((option: any) => {
        if (typeof option === 'string' || typeof option === 'number') {
          return new Option(option);
        } else {
          return new Option({
            id: option['id'],
            value: option['value'],
          });
        }
      });
    }
  }

  @Output('onDropDownClose')
  onDropDownClose: EventEmitter<Option> = new EventEmitter<any>();

  @Output('onSelect')
  onSelect: EventEmitter<Option> = new EventEmitter<any>();

  @Output('onUnSelect')
  onUnSelect: EventEmitter<Option> = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  onOptionSelect($event: any, option: Option) {
    if (!this.isSelected(option)) {
      this.addSelected(option);
    } else {
      this.removeSelected(option);
    }
  }

  writeValue(value: any) {
    if (value !== undefined && value !== null && value.length > 0) {
      const _data = value.map((option: any) => {
        if (typeof option === 'string' || typeof option === 'number') {
          return new Option(option);
        } else {
          return new Option({
            id: option['id'],
            value: option['value'],
          });
        }
      });

      this.selectedOptions = _data;
    } else {
      this.selectedOptions = [];
    }

    this.cdr.markForCheck();
  }

  trackByFn(index, option) {
    return option.id;
  }

  isSelected(option: Option) {
    let found = false;
    this.selectedOptions.forEach((selected) => {
      if (option.id === selected.id) {
        found = true;
      }
    });
    return found;
  }

  addSelected(selectedOption: Option) {
    this.selectedOptions.push(selectedOption);

    this.onSelect.emit(this.emittedValue(selectedOption));
  }

  removeSelected(unselectedOption: Option) {
    this.selectedOptions.forEach((selected) => {
      if (unselectedOption.id === selected.id) {
        this.selectedOptions.splice(this.selectedOptions.indexOf(selected), 1);
      }
    });
    this.onUnSelect.emit(this.emittedValue(unselectedOption));
  }

  emittedValue(val: any): any {
    const selected = [];
    if (Array.isArray(val)) {
      val.map((opt) => {
        selected.push(this.objectify(opt));
      });
    } else {
      if (val) {
        return this.objectify(val);
      }
    }
    return selected;
  }

  objectify(val: Option) {
    if (this._sourceDataType === 'object') {
      const obj = {};
      obj['id'] = val.id;
      obj['value'] = val.value;

      return obj;
    }
    if (this._sourceDataType === 'number') {
      return Number(val.id);
    } else {
      return val.value;
    }
  }

  toggleDropdown(evt) {
    evt.preventDefault();
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.onDropDownClose.emit();
    }
  }

  closeDropdown() {
    this.isOpen = false;
    this.onDropDownClose.emit();
  }

  getFields(inputData) {
    const fields = [];
    if (typeof inputData !== 'object') {
      return fields;
    }

    for (const prop in inputData) {
      fields.push(prop);
    }
    return fields;
  }
}

export class Option {
  id: any;
  value: any;

  public constructor(input: any) {
    if (typeof input === 'string' || typeof input === 'number') {
      this.id = input;
      this.value = input;
    }

    if (typeof input === 'object') {
      this.id = input.id;
      this.value = input.value;
    }
  }
}
