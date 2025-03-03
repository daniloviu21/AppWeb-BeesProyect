import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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

  alertButtons = ['Aceptar'];

  carrito: CarritoItem[] = [];
  usuarioActual: any;
  total: number = 0;
  tienecarro: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private usuariosService: UsuariosService,
    private alertController: AlertController
  ) {}

  async ionViewWillEnter() {
    this.usuarioActual = this.usuariosService.getUsuario();
    if (this.usuarioActual) {
      this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.user);
      this.calcularTotal();
      this.actualizarEstadoCarrito();
    }
  }

  async eliminarProducto(producto: CarritoItem) {
    if (this.usuarioActual) {
      await this.carritoService.eliminarProducto(this.usuarioActual.user, producto.producto);
      this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.user);
      this.calcularTotal();
      this.actualizarEstadoCarrito();
    }
  }

  async limpiarCarrito() {
    const alert = await this.alertController.create({
      header: 'Limpiar carrito',
      message: 'Se eliminarán todos los productos del carrito. ¿Estás seguro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Continuar',
          handler: () => {
            this.borrarElementos();
          }
        }
      ]
    });

    await alert.present();
  }

  async borrarElementos() {
    if (this.usuarioActual) {
      await this.carritoService.limpiarCarrito(this.usuarioActual.user);
      this.carrito = [];
      this.total = 0;
      this.actualizarEstadoCarrito();
    }
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  actualizarEstadoCarrito() {
    this.tienecarro = this.carrito.length > 0;
  }
  
}