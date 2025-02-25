import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritocomprasPageRoutingModule } from './carritocompras-routing.module';

import { CarritocomprasPage } from './carritocompras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritocomprasPageRoutingModule
  ],
  declarations: [CarritocomprasPage]
})
export class CarritocomprasPageModule {}
