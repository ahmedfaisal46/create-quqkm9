import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TestComponent],
  exports: [TestComponent],
})
export class TestModule {
  static forRoot(): ModuleWithProviders<TestModule> {
    return {
      ngModule: TestModule,
    };
  }
}
