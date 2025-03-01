import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { CarritoItem } from 'src/app/services/productos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-carritocompras',
  templateUrl: './carritocompras.page.html',
  styleUrls: ['./carritocompras.page.scss'],
  standalone: false
})
export class CarritocomprasPage {

  carrito: CarritoItem[] = [];
  usuarioActual: any;
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private usuariosService: UsuariosService
  ) {}

  async ionViewWillEnter() {
    this.usuarioActual = this.usuariosService.getUsuario();
    if (this.usuarioActual) {
      this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.user);
      this.calcularTotal();
    }
  }

  async eliminarProducto(producto: CarritoItem) {
    if (this.usuarioActual) {
      await this.carritoService.eliminarProducto(this.usuarioActual.user, producto.producto);
      this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.user);
      this.calcularTotal();
    }
  }

  async limpiarCarrito() {
    if (this.usuarioActual) {
      await this.carritoService.limpiarCarrito(this.usuarioActual.user);
      this.carrito = [];
      this.total = 0;
    }
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }
  
}