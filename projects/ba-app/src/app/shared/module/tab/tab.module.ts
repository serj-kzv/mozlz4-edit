import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsComponent} from './tabs/tabs.component';
import {TabContentComponent} from './tab/tab-content.component';


@NgModule({
    declarations: [TabsComponent, TabContentComponent],
    imports: [
        CommonModule
    ],
    exports: [
        TabsComponent,
        TabContentComponent
    ]
})
export class TabModule {
}
