import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliticaPrivacidadPage } from './politica-privacidad.page';

const routes: Routes = [
  {
    path: '',
    component: PoliticaPrivacidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoliticaPrivacidadPageRoutingModule {}
