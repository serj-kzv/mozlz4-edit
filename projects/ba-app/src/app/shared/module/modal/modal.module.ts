import {NgModule} from '@angular/core';
import {ModalComponent} from './modal.component';
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
  ],
})
export class ModalModule { }
