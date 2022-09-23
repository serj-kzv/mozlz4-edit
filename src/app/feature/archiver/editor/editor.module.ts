import {NgModule} from '@angular/core';
import {EditorComponent} from './editor.component';
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
  declarations: [EditorComponent],
  exports: [
    EditorComponent
  ],
  imports: [
    SharedModule
  ]
})
export class EditorModule { }
