import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ValidationModule } from '../app/Shared/Validation/validation.component';
import { GetSumValuePipe } from '../Pipe/GetSumValue.pipe';
import { AbsstatusModule } from '../app/Shared/absstatus/absstatus.component';
import { LoadImage } from '../Pipe/LoadImage.pipe';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    // NumericDirective,
    // DropdownFooterDirective,
    // GetSumValuePipe,
    // LoadImage,
  ],
  imports: [

  ],
  providers: [
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    AbsstatusModule,
    // NumericDirective,
    // DropdownFooterDirective,
    ValidationModule,
    // GetSumValuePipe,
    // LoadImage,
    InputNumberModule,
  ]
})
export class ModuleData { }
