import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/services/productos.service';

@Component({
  selector: 'app-carritocompras',
  templateUrl: './carritocompras.page.html',
  styleUrls: ['./carritocompras.page.scss'],
  standalone: false
})
export class CarritocomprasPage implements OnInit {
  carrito: Producto[] = []; // Arreglo para almacenar los productos del carrito

  constructor() { }

  ngOnInit() {
    // Obtener los productos del carrito desde la navegación
    if (history.state.carrito) {
      this.carrito = history.state.carrito;
    }
  }
}