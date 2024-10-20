import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'restore-password',
    loadChildren: () => import('./pages/restore-password/restore-password.module').then(m => m.RestorePasswordPageModule)
  },
  {
    path: 'tab',
    loadChildren: () => import('./pages/tab/tab.module').then(m => m.TabPageModule)
  },  {
    path: 'catdog-api',
    loadChildren: () => import('./pages/catdog-api/catdog-api.module').then( m => m.CatdogApiPageModule)
  },
  {
    path: 'menu-mas',
    loadChildren: () => import('./pages/menu-mas/menu-mas.module').then( m => m.MenuMasPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
