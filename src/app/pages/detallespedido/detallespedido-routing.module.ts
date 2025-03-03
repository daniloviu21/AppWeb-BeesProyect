
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallespedidoPage } from './detallespedido.page';

const routes: Routes = [
  {
    path: '',
    component: DetallespedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallespedidoPageRoutingModule {}
