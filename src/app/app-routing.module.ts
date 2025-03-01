
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
  },
  {
    path: 'agregar-direccion',
    loadChildren: () => import('./agregar-direccion/agregar-direccion.module').then( m => m.AgregarDireccionPageModule)
  },
  {
    path: 'categorias-layout',
    loadChildren: () => import('./pages/categorias-layout/categorias-layout.component').then( m => m.CategoriasLayoutComponent)
  },
  {
    path: 'productos/:categoria',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  
  {
    path: 'metodos-pago',
    loadChildren: () => import('./metodos-pago/metodos-pago.module').then( m => m.MetodosPagoPageModule)
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./terminos-condiciones/terminos-condiciones.module').then( m => m.TerminosCondicionesPageModule)
  },
  { 
    path: 'cambiar-direccion',
    loadChildren: () => import('./cambiar-direccion/cambiar-direccion.module').then( m => m.CambiarDireccionPageModule)
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./terminos-condiciones/terminos-condiciones.module').then( m => m.TerminosCondicionesPageModule)
  }
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}