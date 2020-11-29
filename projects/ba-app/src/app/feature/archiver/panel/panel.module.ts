import {NgModule} from '@angular/core';
import {PanelComponent} from './panel.component';
import {SharedModule} from "../../../shared/shared.module";
import {AddEngineModalModule} from "./add-engine-modal/add-engine-modal.module";


@NgModule({
    declarations: [PanelComponent],
    exports: [
        PanelComponent,
    ],
    imports: [
        SharedModule,
        AddEngineModalModule,
    ]
})
export class PanelModule { }
