import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminosCondicionesPage } from './terminos-condiciones.page';

const routes: Routes = [
  {
    path: '',
    component: TerminosCondicionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminosCondicionesPageRoutingModule {}
