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
  usuario: Usuario | null = null;
  carrito: any[] = [];
  total: number = 0;
  direccionSeleccionada: Direccion | null = null;
  metodoPagoSeleccionado: MetodosPago | null = null;
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
    await this.loadData();
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.usuario = this.usuariosService.getUsuario();
    
    if (!this.usuario) {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login']);
      return;
    }
  
    try {
      // Cargar carrito
      this.carrito = await this.carritoService.obtenerCarrito(Number(this.usuario.id));
      this.calcularTotal();
  
      // Cargar direcciones y métodos de pago actualizados
      await this.cargarDireccionesYMetodos();
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async cargarDireccionesYMetodos() {
    if (!this.usuario?.id) return;
  
    // Cargar direcciones actualizadas
    this.usuariosService.obtenerDirecciones(this.usuario.id).subscribe(
      (direcciones) => {
        this.tieneDirecciones = direcciones.length > 0;
        this.direccionSeleccionada = this.tieneDirecciones ? direcciones[0] : null;
        
        // Actualizar en el objeto usuario
        if (this.usuario) {
          this.usuario.direccion = direcciones;
          this.usuariosService.actualizarUsuarioLocal(this.usuario);
        }
      },
      (error) => console.error('Error al cargar direcciones:', error)
    );
  
    // Cargar métodos de pago actualizados
    this.usuariosService.obtenerMetodosPago(this.usuario.id).subscribe(
      (metodosPago) => {
        this.tieneMetodosPago = metodosPago.length > 0;
        this.metodoPagoSeleccionado = this.tieneMetodosPago ? metodosPago[0] : null;
        
        // Actualizar en el objeto usuario
        if (this.usuario) {
          this.usuario.metodospago = metodosPago;
          this.usuariosService.actualizarUsuarioLocal(this.usuario);
        }
      },
      (error) => console.error('Error al cargar métodos de pago:', error)
    );
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  cambiarDireccion() {
    this.router.navigate(['/cambiar-direccion']);
  }

  cambiarTarjeta() {
    this.router.navigate(['/metodos-pago']);
  }

  async pagar() {
    if (!this.direccionSeleccionada || !this.metodoPagoSeleccionado) {
      console.error('Dirección o método de pago no seleccionado');
      return;
    }

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
            this.generarPedido();
          }
        }
      ]
    });

    await alert.present();
  }

  generarPedido() {
    if (!this.usuario || !this.direccionSeleccionada || !this.metodoPagoSeleccionado) {
      console.error('Datos incompletos para generar pedido');
      return;
    }
    
    const nuevoPedido: Pedido = {
      id: Math.random().toString(36).substring(2),
      usuarioId: Number(this.usuario.id).toString(), // Usar id en lugar de usuario
      fecha: new Date(),
      productos: this.carrito.map(item => ({
        nombreproducto: item.producto.nombreproducto,
        cantidad: item.cantidad,
        precio: item.producto.precio
      })),
      total: this.total,
      direccion: this.direccionSeleccionada.calle,
      metodoPago: `${this.metodoPagoSeleccionado.tipo} (•••• ${this.metodoPagoSeleccionado.numeroTarjeta.substring(12, 16)})`,
      estado: 'En proceso'
    };
  
    this.pedidosService.agregarPedido(nuevoPedido);
    this.router.navigate(['/tabs/tab3']);

    this.carritoService.limpiarCarrito(Number(this.usuario.id).toString());
    this.carrito = [];
    this.total = 0;
  }

  getCardImage(numero: string | undefined): string {
    if (!numero) return 'assets/img/default-card.png';
    return numero.startsWith('4') ? 'assets/img/visa.png' : 'assets/img/mastercard.png';
  }
}