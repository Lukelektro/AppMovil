import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login', //redirige al login al principio
    pathMatch: 'full'
  },  {
    path: 'ofertas',
    loadChildren: () => import('./pages/ofertas/ofertas.module').then( m => m.OfertasPageModule)
  },
  {
    path: 'citas',
    loadChildren: () => import('./pages/citas/citas.module').then( m => m.CitasPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },

  
];




@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
