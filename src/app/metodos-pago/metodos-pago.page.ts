import { Component, OnInit } from '@angular/core';
import { MetodosPago, Usuario, UsuariosService } from '../services/usuarios.service';
import { ModalController, ToastController } from '@ionic/angular';

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

  constructor(
    private usuarioService: UsuariosService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario?.id) {
      this.cargarMetodosPago(this.usuario.id);
    } else {
      console.error('Usuario no autenticado o ID no definido');
    }
  }

  cargarMetodosPago(idCliente: number) {
    this.usuarioService.obtenerMetodosPago(idCliente).subscribe(
      (metodosPago) => {
        this.metodosPago = metodosPago;
        if (this.metodosPago.length > 0) {
          this.metodoSeleccionado = this.metodosPago[metodosPago.length - 1];
        }
      },
      (error) => {
        console.error('Error al cargar métodos de pago:', error);
      }
    );
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  formatCaducidad(event: any) {
    const value = event.target.value.replace(/\D/g, ''); // Solo acepta números
    if (value.length >= 2) {
      this.metodoSeleccionado.fechaVencimiento = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      this.metodoSeleccionado.fechaVencimiento = value;
    }
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
    const { numeroTarjeta, fechaVencimiento, cvv } = this.metodoSeleccionado;
  
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
    this.metodoSeleccionado.tipo = numeroTarjeta.startsWith('4') ? 'Visa' : 'Mastercard';
  
    const usuario = this.usuarioService.getUsuario();
    if (usuario && usuario.id) {
      this.usuarioService.agregarMetodoPago(usuario.id, this.metodoSeleccionado).subscribe(
        (metodoPago) => {
          this.metodosPago.push(metodoPago);
          this.mostrarToast('Método de pago agregado exitosamente', 'success');
          this.metodoSeleccionado = { tipo: '', numeroTarjeta: '', fechaVencimiento: '', cvv: '' }; // Limpiar formulario
          this.modalCtrl.dismiss(); // Cerrar el modal
        },
        (error) => {
          console.error('Error al agregar método de pago:', error);
          this.mostrarToast('Error al agregar método de pago');
        }
      );
    } else {
      alert('No hay usuario autenticado o ID no definido');
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
