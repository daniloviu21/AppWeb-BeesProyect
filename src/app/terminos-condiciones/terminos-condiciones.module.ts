import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminosCondicionesPageRoutingModule } from './terminos-condiciones-routing.module';

import { TerminosCondicionesPage } from './terminos-condiciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminosCondicionesPageRoutingModule
  ],
  declarations: [TerminosCondicionesPage]
})
export class TerminosCondicionesPageModule {}
