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
        path: 'menu-mas',
        loadChildren: () => import('./../../pages/menu-mas/menu-mas.module').then( m => m.MenuMasPageModule)
      },
      {
        path : 'perfil',
        loadChildren: () => import('./../../pages/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path : 'catdog-api',
        loadChildren: () => import('./../../pages/catdog-api/catdog-api.module').then( m => m.CatdogApiPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
