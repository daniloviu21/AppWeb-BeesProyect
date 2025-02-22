import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  constructor(private toastController: ToastController, private router: Router) { }

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
      this.mostrarMensaje('Correo o Contraseña no válida');
      return;
    }

    this.mostrarMensaje('Inicio de sesión exitoso');
    this.router.navigate(['/tabs/tab1']);
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
