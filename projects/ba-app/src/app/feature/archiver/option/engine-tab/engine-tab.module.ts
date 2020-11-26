import {NgModule} from '@angular/core';
import {EngineTabComponent} from './engine-tab.component';
import {SharedModule} from "../../../../shared/shared.module";


@NgModule({
  declarations: [EngineTabComponent],
  imports: [
    SharedModule
  ],
  exports: [
      EngineTabComponent
  ]
})
export class EngineTabModule { }
