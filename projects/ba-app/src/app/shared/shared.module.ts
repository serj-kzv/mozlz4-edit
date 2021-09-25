import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from './component/page-not-found/page-not-found.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalModule} from "./module/modal/modal.module";
import {TabModule} from "./module/tab/tab.module";
import {MatGridListModule} from "@angular/material/grid-list";

@NgModule({
    declarations: [
        // Components
        PageNotFoundComponent,

        // Directives
    ],
    imports: [
        // Angular Modules
        CommonModule,
        ReactiveFormsModule,
        FormsModule,

        // Shared Modules
        ModalModule,
        TabModule,

        // Angular Material Modules
        MatGridListModule,
    ],
    exports: [
        // Angular Modules
        CommonModule,
        ReactiveFormsModule,
        FormsModule,

        // Shared Modules
        ModalModule,
        TabModule,

        // Components
        PageNotFoundComponent,

        // Directives

        // Angular Material Modules
        MatGridListModule,

        // Covalent Modules
    ]
})
export class SharedModule {
}
