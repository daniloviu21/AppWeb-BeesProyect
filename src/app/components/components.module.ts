import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarritoLayoutComponent } from '../pages/carrito-layout/carrito-layout.component';
import { CategoriasLayoutComponent } from '../pages/categorias-layout/categorias-layout.component';
import { CardInfoComponent } from './card-info/card-info.component';



@NgModule({
  declarations: [
    CardInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CardInfoComponent
  ]
})
export class ComponentsModule { }
