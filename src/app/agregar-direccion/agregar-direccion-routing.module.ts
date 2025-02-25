import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarDireccionPage } from './agregar-direccion.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarDireccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarDireccionPageRoutingModule {}
