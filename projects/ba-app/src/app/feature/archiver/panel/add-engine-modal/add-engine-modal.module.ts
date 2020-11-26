import {NgModule} from '@angular/core';
import {AddEngineModalComponent} from './add-engine-modal.component';
import {SharedModule} from "../../../../shared/shared.module";
import {AddEngineModalRoutingModule} from "./add-engine-modal-routing.module";


@NgModule({
  declarations: [AddEngineModalComponent],
  imports: [
    SharedModule,
    AddEngineModalRoutingModule
  ],
  exports: [
      AddEngineModalComponent
  ]
})
export class AddEngineModalModule { }
