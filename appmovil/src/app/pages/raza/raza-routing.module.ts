import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RazaPage } from './raza.page';

const routes: Routes = [
  {
    path: '',
    component: RazaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RazaPageRoutingModule {}
