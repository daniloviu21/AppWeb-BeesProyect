import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarDireccionPage } from './cambiar-direccion.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarDireccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarDireccionPageRoutingModule {}
