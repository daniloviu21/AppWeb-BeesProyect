import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;

  constructor(private toastController: ToastController, private router: Router) { }

  validarEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailError = !emailPattern.test(this.email) && this.email !== '';
  }

  validarPassword() {
    this.passwordError = this.password.length > 0 && this.password.length < 6;
  }

  validarConfirmPassword() {
    this.confirmPasswordError = this.confirmPassword !== this.password;
  }

  async register() {
    if (!this.firstName || !this.lastName || !this.phone || !this.email || !this.password || !this.confirmPassword) {
      this.mostrarMensaje('Todos los campos son obligatorios');
      return;
    }
    if (this.emailError || this.passwordError || this.confirmPasswordError) {
      this.mostrarMensaje('Corrija los errores antes de continuar');
      return;
    }

    this.mostrarMensaje('Registro exitoso');
    this.router.navigate(['/tabs/tab1']);
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'primary',
    });
    toast.present();
  }
}
