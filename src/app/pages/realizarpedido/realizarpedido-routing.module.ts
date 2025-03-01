import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RealizarpedidoPage } from './realizarpedido.page';

const routes: Routes = [
  {
    path: '',
    component: RealizarpedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealizarpedidoPageRoutingModule {}
