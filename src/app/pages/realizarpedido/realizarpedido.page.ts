import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
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
    private pedidosService: PedidosService,
    private loadingController: LoadingController
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
        this.direccionSeleccionada = this.tieneDirecciones ? direcciones[direcciones.length-1] : null;
        
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
        this.metodoPagoSeleccionado = this.tieneMetodosPago ? metodosPago[metodosPago.length-1] : null;
        
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

  async generarPedido() {
    if (!this.usuario?.id || !this.direccionSeleccionada?.id || !this.metodoPagoSeleccionado?.id) {
      console.error('Datos incompletos para generar pedido');
      return;
    }
  
    const productosParaAPI = this.carrito.map(item => ({
      idProducto: item.producto.id,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio
    }));
  
    const loading = await this.mostrarLoading();
  
    this.pedidosService.crearPedidoConDetalles({
      idCliente: this.usuario.id,
      idDireccion: this.direccionSeleccionada.id,
      idMetodoPago: this.metodoPagoSeleccionado.id,
      productos: productosParaAPI
    }).subscribe({
      next: async (pedidoCreado) => {
        await loading.dismiss();
        console.log('Pedido y detalles creados:', pedidoCreado);
        if (this.usuario && this.usuario.id) {
          await this.carritoService.limpiarCarrito(this.usuario.id.toString());
        }
        this.carrito = [];
        this.total = 0;
        this.router.navigate(['/tabs/tab3']);
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Error al crear pedido:', error);
        await this.mostrarError('Error al crear el pedido. Por favor, inténtalo de nuevo.');
      }
    });
  }

  async mostrarLoading() {
    const loading = await this.loadingController.create({
      message: 'Procesando pedido...',
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  getCardImage(tipo: string): string {
    if (tipo.toLowerCase() === 'visa') {
      return 'assets/img/visa.png';
    } else {
      return 'assets/img/mastercard.png';
    }
  }
}