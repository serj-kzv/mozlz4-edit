import {NgModule} from '@angular/core';

import {OptionRoutingModule} from './option-routing.module';
import {OptionComponent} from './option.component';
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
    declarations: [OptionComponent],
    imports: [
        SharedModule,
        OptionRoutingModule
    ],
    exports: [
        OptionComponent
    ]
})
export class OptionModule {
}
