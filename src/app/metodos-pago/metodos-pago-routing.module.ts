import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodosPagoPage } from './metodos-pago.page';

const routes: Routes = [
  {
    path: '',
    component: MetodosPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodosPagoPageRoutingModule {}
