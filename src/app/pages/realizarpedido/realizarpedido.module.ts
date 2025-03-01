import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealizarpedidoPageRoutingModule } from './realizarpedido-routing.module';

import { RealizarpedidoPage } from './realizarpedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RealizarpedidoPageRoutingModule
  ],
  declarations: [RealizarpedidoPage]
})
export class RealizarpedidoPageModule {}
