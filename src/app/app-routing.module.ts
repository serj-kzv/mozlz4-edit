import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./shared/component/page-not-found/page-not-found.component";
import {environment} from "../environments/environment";

const routes: Routes = [
    {
        path: 'archiver',
        loadChildren: () => import('./feature/archiver/archiver.module').then(m => m.ArchiverModule)
    },
    {path: '', redirectTo: 'archiver', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent},
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
                enableTracing: !environment.production, // <-- debugging purposes only
            }
        ),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
