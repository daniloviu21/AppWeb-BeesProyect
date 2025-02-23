import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarDireccionPageRoutingModule } from './agregar-direccion-routing.module';

import { AgregarDireccionPage } from './agregar-direccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarDireccionPageRoutingModule
  ],
  declarations: [AgregarDireccionPage]
})
export class AgregarDireccionPageModule {}
