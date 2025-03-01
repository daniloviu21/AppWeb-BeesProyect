import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
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
    private router: Router
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

  pagar() {
    if (!this.tieneDirecciones || !this.tieneMetodosPago) {
      console.log("Debes agregar una dirección y un método de pago antes de continuar.");
      return;
    }
    console.log("Proceso de pago aún no implementado");
  }

  getCardImage(numero: string): string {
    if (numero.startsWith('4')) {
      return 'assets/img/visa.png';
    } else {
      return 'assets/img/mastercard.png';
    }
  }
}