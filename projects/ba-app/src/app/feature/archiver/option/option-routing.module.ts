import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OptionComponent} from "./option.component";

const routes: Routes = [
  {
    path: '',
    component: OptionComponent,
    canActivate: [],
    children: [
      {
        path: 'engine-tab',
        loadChildren: () => import('./engine-tab/engine-tab.module').then(m => m.EngineTabModule)
      },
      {
        path: 'download-tab',
        loadChildren: () => import('./download-tab/download-tab.module').then(m => m.DownloadTabModule)
      },
      {
        path: '',
        redirectTo: 'engine-tab',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionRoutingModule { }
