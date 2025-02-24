import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarDireccionPageRoutingModule } from './cambiar-direccion-routing.module';

import { CambiarDireccionPage } from './cambiar-direccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarDireccionPageRoutingModule
  ],
  declarations: [CambiarDireccionPage]
})
export class CambiarDireccionPageModule {}
