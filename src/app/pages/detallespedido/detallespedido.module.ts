import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallespedidoPageRoutingModule } from './detallespedido-routing.module';

import { DetallespedidoPage } from './detallespedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallespedidoPageRoutingModule
  ],
  declarations: [DetallespedidoPage]
})
export class DetallespedidoPageModule {}
