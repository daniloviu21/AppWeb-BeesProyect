import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },  {
    path: 'cambiar-direccion',
    loadChildren: () => import('./cambiar-direccion/cambiar-direccion.module').then( m => m.CambiarDireccionPageModule)
  },
  {
    path: 'metodos-pago',
    loadChildren: () => import('./metodos-pago/metodos-pago.module').then( m => m.MetodosPagoPageModule)
  },
  {
    path: 'politica-privacidad',
    loadChildren: () => import('./politica-privacidad/politica-privacidad.module').then( m => m.PoliticaPrivacidadPageModule)
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./terminos-condiciones/terminos-condiciones.module').then( m => m.TerminosCondicionesPageModule)
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },

  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
