import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {ModalModule} from "../shared/module/modal/modal.module";
import {MatGridListModule} from "@angular/material/grid-list";

@NgModule({
    declarations: [],
    imports: [
        // Modules
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,

        // Angular Material Modules
        NoopAnimationsModule,

        // Custom Modules
        ModalModule,
    ],
    exports: [
        // Modules
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,

        // Angular Material Modules
        NoopAnimationsModule,

        // Custom Modules
        ModalModule,
    ],
})
export class CoreModule {
}
