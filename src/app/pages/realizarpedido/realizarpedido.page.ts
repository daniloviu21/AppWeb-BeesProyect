import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { Pedido, PedidosService } from 'src/app/services/pedidos.service';
import { Direccion, MetodosPago, Usuario, UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-realizarpedido',
  templateUrl: './realizarpedido.page.html',
  styleUrls: ['./realizarpedido.page.scss'],
  standalone: false
})
export class RealizarpedidoPage implements OnInit {
  usuario!: Usuario | null;
  carrito: any[] = [];
  total: number = 0;
  direccionSeleccionada!: Direccion;
  metodoPagoSeleccionado!: MetodosPago;
  tieneDirecciones: boolean = false;
  tieneMetodosPago: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private usuariosService: UsuariosService,
    private router: Router,
    private alertController: AlertController,
    private pedidosService: PedidosService
  ) {}

  async ngOnInit() {
    this.usuario = this.usuariosService.getUsuario();
    if (this.usuario) {
      this.carrito = await this.carritoService.obtenerCarrito(this.usuario.user);
      this.calcularTotal();
  
      // Verificar si el usuario tiene direcciones
      if (this.usuario.direccion && this.usuario.direccion.length > 0) {
        this.tieneDirecciones = true;
        this.direccionSeleccionada = this.usuario.direccion[0];
      } else {
        this.tieneDirecciones = false;
      }
  
      // Verificar si el usuario tiene métodos de pago
      if (this.usuario.metodospago && this.usuario.metodospago.length > 0) {
        this.tieneMetodosPago = true;
        this.metodoPagoSeleccionado = this.usuario.metodospago[0];
      } else {
        this.tieneMetodosPago = false;
      }
    }
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  cambiarDireccion() {
    console.log("Cambiar Dirección");
    this.router.navigate(['/cambiar-direccion']); // Redirige a la página para agregar dirección
  }

  cambiarTarjeta() {
    console.log("Cambiar Tarjeta");
    this.router.navigate(['/metodos-pago']); // Redirige a la página para agregar método de pago
  }

  async pagar() {
    const alert = await this.alertController.create({
      header: 'Confirmar Pedido',
      message: '¿Estás seguro de que deseas realizar este pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Pedido cancelado');
          }
        },
        {
          text: 'Continuar',
          handler: () => {
            console.log('Pedido confirmado');
            this.generarPedido();
          }
        }
      ]
    });

    await alert.present();
  }

  generarPedido() {
    if (!this.usuario) {
      console.error('Usuario no autenticado');
      return;
    }
    
    const nuevoPedido: Pedido = {
      id: Math.random().toString(36).substring(2), // Generar un ID único
      usuarioId: this.usuario.user, // Vincular el pedido al usuario actual
      fecha: new Date(),
      productos: this.carrito.map(item => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.producto.precio
      })),
      total: this.total,
      direccion: this.direccionSeleccionada.direccion,
      metodoPago: `${this.metodoPagoSeleccionado.tipo} (•••• ${this.metodoPagoSeleccionado.numero.substring(12, 16)})`,
      estado: 'En proceso'
    };
  
    // Guardar el pedido usando el servicio
    this.pedidosService.agregarPedido(nuevoPedido);
    this.router.navigate(['/tabs/tab3']);

    if (this.usuario) {
      this.carritoService.limpiarCarrito(this.usuario.user);
      this.carrito = [];
      this.total = 0;
    }
  }

  getCardImage(numero: string): string {
    if (numero.startsWith('4')) {
      return 'assets/img/visa.png';
    } else {
      return 'assets/img/mastercard.png';
    }
  }
}