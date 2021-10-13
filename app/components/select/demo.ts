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
      { id: 1, value: 'Value one' },
      { id: 2, value: 'Value two' },
      { id: 3, value: 'Value three' },
      { id: 4, value: 'Value four' },
      { id: 5, value: 'Value five' },
      { id: 6, value: 'Value six' },
    ];

    this.myForm = this.fb.group({
      options: [''],
    });
  }

  onItemSelect(item: any) {
    console.log('onItemSelect');
  }
  onItemDeSelect(item: any) {
    console.log('onItemDeSelect');
  }

  onDropDownClose() {
    console.log('dropdown closed');
  }
}
