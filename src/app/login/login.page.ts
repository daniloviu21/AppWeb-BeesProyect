import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  usuario: string = '';
  password: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;

  constructor(private toastController: ToastController) { }

  validarEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailError = !emailPattern.test(this.usuario) && this.usuario !== '';
  }

  validarPassword() {
    this.passwordError = this.password.length > 0 && this.password.length < 6;
  }

  async login() {
    if (!this.usuario || !this.password) {
      this.mostrarMensaje('Todos los campos son obligatorios');
      return;
    }
    if (this.emailError || this.passwordError) {
      this.mostrarMensaje('Corrige los errores antes de continuar');
      return;
    }

    // Aquí iría la lógica de autenticación
    this.mostrarMensaje('Inicio de sesión exitoso');
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'danger',
    });
    toast.present();
  }
}
