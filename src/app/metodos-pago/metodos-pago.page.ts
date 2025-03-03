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

  alertButtons = ['Aceptar'];

  usuario!: Usuario | null;

  metodo: MetodosPago = {
    tipo: '',
    numero: '',
    fechav: '',
    cvv: ''
  };

  constructor(private usuarioService: UsuariosService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  formatCaducidad(event: any) {
    const value = event.target.value.replace(/\D/g, ''); // Solo acepta numeros
    if (value.length >= 2) {
      this.metodo.fechav = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      this.metodo.fechav = value;
    }
  }

  getCardImage(numero: string): string {
    if (numero.startsWith('4')) {
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
  

  async agregarMetodoPago() {
    const { numero, fechav, cvv } = this.metodo;

    if (!numero || numero.length !== 16) {
      alert('Ingrese un número de tarjeta válido (16 dígitos)');
      return;
    }
    if (!fechav || fechav.length !== 5) {
      alert('Ingrese una fecha de caducidad válida (MM/YY)');
      return;
    }
    if (!cvv || cvv.length !== 3) {
      alert('Ingrese un CVV válido (3 dígitos)');
      return;
    }

    const usuario = this.usuarioService.getUsuario();
    if (usuario) {
      this.metodo.tipo = numero.startsWith('4') ? 'Visa' : 'Mastercard';
      usuario.metodospago.push({ ...this.metodo }); // Guardar método de pago en el usuario
      await this.usuarioService.saveCurrentUser(); // Guardar usuario en el storage
      this.modalCtrl.dismiss();
      alert('Método de pago agregado exitosamente');
      this.metodo = { tipo: 'Tarjeta', numero: '', fechav: '', cvv: '' };
    } else {
      alert('No hay usuario autenticado');
    }
  }

}