import {NgModule} from '@angular/core';
import {DownloadTabComponent} from './download-tab.component';
import {SharedModule} from "../../../../shared/shared.module";


@NgModule({
  declarations: [DownloadTabComponent],
  imports: [
    SharedModule
  ],
  exports: [
    DownloadTabComponent
  ]
})
export class DownloadTabModule { }
