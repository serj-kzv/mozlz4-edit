import {NgModule} from '@angular/core';

import {ArchiverRoutingModule} from './archiver-routing.module';
import {ArchiverComponent} from './archiver.component';
import {SharedModule} from "../../shared/shared.module";
import {PanelModule} from "./panel/panel.module";
import {EditorModule} from "./editor/editor.module";


@NgModule({
    declarations: [ArchiverComponent],
    imports: [
        SharedModule,
        ArchiverRoutingModule,

        PanelModule,
        EditorModule
    ]
})
export class ArchiverModule {
}
