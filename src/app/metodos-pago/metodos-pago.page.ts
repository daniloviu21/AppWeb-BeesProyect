import { Component, OnInit } from '@angular/core';
import { MetodosPago, Usuario, UsuariosService } from '../services/usuarios.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
  standalone: false
})
export class MetodosPagoPage implements OnInit {

  usuario: Usuario | null = null;

  metodo: MetodosPago = {
    tipo: '',
    numero: '',
    fechav: '',
    cvv: ''
  };

  constructor(private usuarioService: UsuariosService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  formatCaducidad(event: any) {
    const value = event.target.value.replace(/\D/g, ''); // Solo acepta números
    if (value.length >= 2) {
      this.metodo.fechav = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      this.metodo.fechav = value;
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  validateFecha(fechav: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    return regex.test(fechav);
  }

  async agregarMetodoPago() {
    const { numero, fechav, cvv } = this.metodo;

    if (!numero || numero.length !== 16) {
      alert('Ingrese un número de tarjeta válido (16 dígitos)');
      return;
    }
    if (!fechav || !this.validateFecha(fechav)) {
      alert('Ingrese una fecha de caducidad válida (MM/YY)');
      return;
    }
    if (!cvv || cvv.length !== 3) {
      alert('Ingrese un CVV válido (3 dígitos)');
      return;
    }

    if (this.usuario) {
      this.metodo.tipo = numero.startsWith('4') ? 'Visa' : 'Mastercard';
      this.usuario.metodospago.push({ ...this.metodo }); // Agregar el nuevo método de pago
      await this.usuarioService.saveCurrentUser(); // Guardar cambios en el storage
      this.modalCtrl.dismiss();
      alert('Método de pago agregado exitosamente');
      this.metodo = { tipo: '', numero: '', fechav: '', cvv: '' };
    } else {
      alert('No hay usuario autenticado');
    }
  }
}
