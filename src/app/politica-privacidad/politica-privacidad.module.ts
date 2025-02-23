import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoliticaPrivacidadPageRoutingModule } from './politica-privacidad-routing.module';

import { PoliticaPrivacidadPage } from './politica-privacidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliticaPrivacidadPageRoutingModule
  ],
  declarations: [PoliticaPrivacidadPage]
})
export class PoliticaPrivacidadPageModule {}
