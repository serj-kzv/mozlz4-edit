import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tab/tab.component';


@NgModule({
    declarations: [TabsComponent, TabComponent],
    imports: [
        CommonModule
    ],
    exports: [
        TabsComponent,
        TabComponent
    ]
})
export class TabModule {
}
