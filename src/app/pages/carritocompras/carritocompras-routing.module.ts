import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritocomprasPage } from './carritocompras.page';

const routes: Routes = [
  {
    path: '',
    component: CarritocomprasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritocomprasPageRoutingModule {}
