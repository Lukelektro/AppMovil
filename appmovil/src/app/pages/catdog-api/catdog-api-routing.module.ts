import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatdogApiPage } from './catdog-api.page';

const routes: Routes = [
  {
    path: '',
    component: CatdogApiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatdogApiPageRoutingModule {}
