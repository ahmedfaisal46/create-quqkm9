import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo',
  templateUrl: './demo.html',
})
export class DemoComponent implements OnInit {
  myForm: FormGroup;
  values: Array<any> = [];
  selectedItems: Array<any> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.values = [
      { id: 0, value: 'Value one' },
      { id: 1, value: 'Value two' },
      { id: 2, value: 'Value three' },
      { id: 3, value: 'Value four' },
      { id: 4, value: 'Value five' },
      { id: 5, value: 'Value six' },
      { id: 6, value: 'Value seven' },
    ];

    this.myForm = this.fb.group({
      options: [''],
    });
  }

  onItemSelect(item: any) {
    console.log('onItemSelect');
  }
  onItemUnSelect(item: any) {
    console.log('onItemUnSelect');
  }

  onDropDownClose() {
    console.log('dropdown closed');
  }
}
