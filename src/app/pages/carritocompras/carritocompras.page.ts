import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoItem, CarritoService } from 'src/app/services/carrito.service';
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
      this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.id);
      this.calcularTotal();
      this.actualizarEstadoCarrito();
      console.log('Carrito actual:', this.carrito);
    }
  }

  async aumentarCantidad(producto: CarritoItem) {
    if (!this.usuarioActual) {
      console.error('Error: Usuario no autenticado');
      return;
    }
    await this.carritoService.agregarProducto(this.usuarioActual.id, producto.producto);
    this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.id);
    this.calcularTotal();
  }

  async eliminarProducto(producto: CarritoItem) {
    if (!this.usuarioActual) {
      console.error('Error: Usuario no autenticado');
      return;
    }
  
    await this.carritoService.eliminarProducto(this.usuarioActual.id, producto.producto);
    
    // Esperar un poco antes de obtener el carrito nuevamente
    setTimeout(async () => {
      this.carrito = await this.carritoService.obtenerCarrito(this.usuarioActual.id);
      this.calcularTotal();
      this.actualizarEstadoCarrito();
    }, 250);
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