import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuMasPage } from './menu-mas.page';

const routes: Routes = [
  {
    path: '',
    component: MenuMasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuMasPageRoutingModule {}
