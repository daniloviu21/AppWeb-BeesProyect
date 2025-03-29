import { Component, OnInit } from '@angular/core';
import { MetodosPago, Usuario, UsuariosService } from '../services/usuarios.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
  standalone: false,
})
export class MetodosPagoPage implements OnInit {
  usuario!: Usuario | null;
  metodoSeleccionado!: MetodosPago;
  metodosPago: MetodosPago[] = []; // Lista de métodos de pago

  nuevoMetodoPago: MetodosPago = {
    tipo: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: ''
  };

  constructor(
    private usuarioService: UsuariosService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.metodoSeleccionado = {} as MetodosPago;
    if (this.usuario?.id) {
      this.cargarMetodosPago(this.usuario.id);
    } else {
      console.error('Usuario no autenticado o ID no definido');
    }
  }

  cargarMetodosPago(idCliente: number) {
    this.usuarioService.obtenerMetodosPago(idCliente).subscribe({
      next: (metodosPago) => {
        this.metodosPago = metodosPago.filter(m => m.deleted_at == null);
        if (this.metodosPago.length > 0) {
          this.metodoSeleccionado = {...this.metodosPago[this.metodosPago.length - 1]};
        }
      },
      error: (error) => {
        console.error('Error al cargar métodos de pago:', error);
      }
    });
  }

  async borrarMetodoPago(metodo: MetodosPago) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar método de pago',
      message: '¿Estás seguro de que quieres eliminar este método de pago?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (metodo.id) {
              this.usuarioService.eliminarMetodoPago(metodo.id).subscribe(
                () => {
                  this.mostrarToast('Método de pago eliminado correctamente', 'success');
                  // Recargar los métodos de pago después de eliminar
                  if (this.usuario?.id) {
                    this.cargarMetodosPago(this.usuario.id);
                  }
                },
                (error) => {
                  console.error('Error al eliminar el método de pago:', error);
                  this.mostrarToast('Error al eliminar el método de pago', 'danger');
                }
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  formatCaducidad(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
      
      const month = parseInt(value.substring(0, 2), 10);
      if (month > 12) {
        value = '12/' + value.substring(3, 5);
      }
    }
    
    this.nuevoMetodoPago.fechaVencimiento = value;
    input.value = value;
  }

  getCardImage(tipo: string): string {
    if (tipo.toLowerCase() === 'visa') {
      return 'assets/img/visa.png';
    } else {
      return 'assets/img/mastercard.png';
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumber = /^[0-9]$/;

    if (!allowedKeys.includes(event.key) && !isNumber.test(event.key)) {
      event.preventDefault();
    }
  }

  isfechavencimientoalida(fechavencimiento: string): boolean {
    const [mes, anio] = fechavencimiento.split('/');
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;

    const mesTarjeta = parseInt(mes, 10);
    const anioTarjeta = parseInt(anio, 10);

    if (anioTarjeta > anioActual) {
      return true;
    } else if (anioTarjeta === anioActual && mesTarjeta >= mesActual) {
      return true;
    } else {
      return false;
    }
  }

  agregarMetodoPago() {
    const { numeroTarjeta, fechaVencimiento, cvv } = this.nuevoMetodoPago;
  
    if (!numeroTarjeta || numeroTarjeta.length !== 16) {
      this.mostrarToast('Tarjeta inválida (16 dígitos)');
      return;
    }
    if (!fechaVencimiento || fechaVencimiento.length !== 5) {
      this.mostrarToast('Fecha de caducidad inválida');
      return;
    }
    if (!cvv || cvv.length !== 3) {
      this.mostrarToast('CVV inválido (3 dígitos)');
      return;
    }
  
    if (!this.isfechavencimientoalida(fechaVencimiento)) {
      this.mostrarToast('Fecha de caducidad inválida');
      return;
    }
  
    // Asignación del tipo de tarjeta
    this.nuevoMetodoPago.tipo = numeroTarjeta.startsWith('4') ? 'Visa' : 'Mastercard';
  
    if (this.usuario?.id) {
      const userId = this.usuario.id; // Store the id in a local variable
      this.usuarioService.agregarMetodoPago(userId, this.nuevoMetodoPago).subscribe(
        (metodoPago) => {
          this.modalCtrl.dismiss().then(() => {
            this.cargarMetodosPago(userId); // Use the local variable
            this.mostrarToast('Método de pago agregado exitosamente', 'success');
            this.nuevoMetodoPago = { tipo: '', numeroTarjeta: '', fechaVencimiento: '', cvv: '' };
          });
        },
        (error) => {
          console.error('Error al agregar método de pago:', error);
          this.mostrarToast('Error al agregar método de pago');
        }
      );
    } else {
      this.mostrarToast('No hay usuario autenticado o ID no definido');
    }
  }

  guardarMetodoPrincipal() {
    if (this.usuario && this.metodoSeleccionado && this.metodoSeleccionado.id) {
      // Agregar un log para verificar los valores antes de la validación
      console.log('Método de pago seleccionado:', this.metodoSeleccionado);
      
      // Verifica si los datos de metodoSeleccionado están completos
      if (!this.metodoSeleccionado.numeroTarjeta || !this.metodoSeleccionado.fechaVencimiento || !this.metodoSeleccionado.cvv) {
        this.mostrarToast('Por favor, complete todos los campos antes de guardar.', 'danger');
        return;
      }
  
      this.usuarioService.editarMetodoPago(this.metodoSeleccionado.id, this.metodoSeleccionado).subscribe(
        (metodoActualizado) => {
          console.log('Método de pago actualizado:', metodoActualizado);
          this.mostrarToast('Método de pago principal cambiado correctamente', 'success');
        },
        (error) => {
          console.error('Error al actualizar el método de pago:', error);
        }
      );
    }
  }

  async abrirModalAgregar() {
    this.nuevoMetodoPago = {
      tipo: '',
      numeroTarjeta: '',
      fechaVencimiento: '',
      cvv: ''
    };
  }

  async mostrarToast(mensaje: string, color: string = 'danger', duracion: number = 2000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}
