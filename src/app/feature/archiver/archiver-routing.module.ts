import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArchiverComponent} from "./archiver.component";

const routes: Routes = [
    {
        path: '',
        component: ArchiverComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArchiverRoutingModule {
}
