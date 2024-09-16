import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    component: TabPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./../../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./../../pages/inventory/inventory.module').then( m => m.InventoryPageModule)
      },
      {
        path: 'citas',
        loadChildren: () => import('./../../pages/citas/citas.module').then( m => m.CitasPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
