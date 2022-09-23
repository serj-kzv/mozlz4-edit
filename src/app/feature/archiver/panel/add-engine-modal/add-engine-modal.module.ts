import {NgModule} from '@angular/core';
import {AddEngineModalComponent} from './add-engine-modal.component';
import {AddEngineFormComponent} from './add-engine-form/add-engine-form.component';
import {SharedModule} from "../../../../shared/shared.module";
import {AddEngineModalRoutingModule} from "./add-engine-modal-routing.module";


@NgModule({
    declarations: [AddEngineModalComponent, AddEngineFormComponent],
    imports: [
        SharedModule,
        AddEngineModalRoutingModule,
    ],
    exports: [
        AddEngineModalComponent,
    ]
})
export class AddEngineModalModule {
}
