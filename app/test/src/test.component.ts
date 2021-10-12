import { Component, HostListener, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TestComponent),
  multi: true
};

@Component({
  selector: "test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
  providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent implements ControlValueAccessor {
  public _data: Array<Item> = [];
  public selectedItems: Array<Item> = [];
  public isDropdownOpen = false;
  private _sourceDataType = null; // to keep note of the source data type. could be array of string/number/object
  private _sourceDataFields: Array<String> = []; // store source data fields names

  @Input()
  placeholder: string = "Select";

  @Input()
  optionTemplate: TemplateRef<any>;

  @Input()
  public set data(value: Array<any>) {
    if (!value) {
      this._data = [];
    } else {
      const firstItem = value[0];
      this._sourceDataType = typeof firstItem;
      this._sourceDataFields = this.getFields(firstItem);
      this._data = value.map((item: any) => {
        if (typeof item === "string" || typeof item === "number") {
          return new Item(item)
        }
        else {
          return new Item({
            id: item["id"],
            value: item["value"],
          })
        }
      }
      );
    }
  }

  @Output("onDropDownClose")
  onDropDownClose: EventEmitter<Item> = new EventEmitter<any>();

  @Output("onSelect")
  onSelect: EventEmitter<Item> = new EventEmitter<any>();

  @Output("onDeSelect")
  onDeSelect: EventEmitter<Item> = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  registerOnChange(fn: any): void {
      
  }
  registerOnTouched(fn: any): void {
   
  }
  

  onItemClick($event: any, item: Item) {
    if (!this.isSelected(item)) {
      this.addSelected(item);
    } else {
      this.removeSelected(item);
    }

  }

  writeValue(value: any) {
    if (value !== undefined && value !== null && value.length > 0) {

      const _data = value.map((item: any) => {
        if (typeof item === "string" || typeof item === "number") {
          return new Item(item)
        }
        else {
          return new Item({
            id: item["id"],
            value: item["value"]
          })
        }
      });
      
        this.selectedItems = _data;
      

    } else {
      this.selectedItems = [];
    }

    this.cdr.markForCheck();
  }

  trackByFn(index, item) {
    return item.id;
  }

  isSelected(clickedItem: Item) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  addSelected(item: Item) {
    
    this.selectedItems.push(item);
    
    this.onSelect.emit(this.emittedValue(item));
  }

  removeSelected(itemSel: Item) {
    this.selectedItems.forEach(item => {
      if (itemSel.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onDeSelect.emit(this.emittedValue(itemSel));
  }

  emittedValue(val: any): any {
    const selected = [];
    if (Array.isArray(val)) {
      val.map(item => {
        selected.push(this.objectify(item));
      });
    } else {
      if (val) {
        return this.objectify(val);
      }
    }
    return selected;
  }

  objectify(val: Item) {
    if (this._sourceDataType === 'object') {
      const obj = {};
      obj["id"] = val.id;
      obj["value"] = val.value;
      
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
    this.isDropdownOpen = !this.isDropdownOpen;
    if (!this.isDropdownOpen) {
      this.onDropDownClose.emit();
    }
  }
  

  closeDropdown() {
    this.isDropdownOpen = false;
    this.onDropDownClose.emit();
  }


  getFields(inputData) {
    const fields = [];
    if (typeof inputData !== "object") {
      return fields;
    }
    // tslint:disable-next-line:forin
    for (const prop in inputData) {
      fields.push(prop);
    }
    return fields;
  }
}

export class Item {
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
