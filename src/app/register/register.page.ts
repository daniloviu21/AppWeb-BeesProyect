import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  nombreCliente: string = '';
  apellidoP: string = '';
  apellidoM: string = '';
  telefono: string = '';
  correo: string = '';
  usuario: string = '';
  contrasenia: string = '';
  confirmPassword: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  validarEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailError = !emailPattern.test(this.correo) && this.correo !== '';
  }

  validarPassword() {
    this.passwordError = this.contrasenia.length > 0 && this.contrasenia.length < 6;
  }

  validarConfirmPassword() {
    this.confirmPasswordError = this.confirmPassword !== this.contrasenia;
  }

  async register() {
    if (!this.nombreCliente || !this.apellidoP || !this.apellidoM || !this.telefono || !this.correo || !this.usuario || !this.contrasenia || !this.confirmPassword) {
      this.mostrarMensaje('Todos los campos son obligatorios');
      return;
    }
    if (this.emailError || this.passwordError || this.confirmPasswordError) {
      this.mostrarMensaje('Corrija los errores antes de continuar');
      return;
    }

    const requestBody = {
      cliente: {
        nombreCliente: this.nombreCliente,
        apellidoP: this.apellidoP,
        apellidoM: this.apellidoM,
        correo: this.correo,
        telefono: this.telefono,
      },
      usuario: {
        usuario: this.usuario,
        contrasenia: this.contrasenia,
        idRol: 1,
      },
    };

    this.usuariosService.crearClienteYUsuario(requestBody).subscribe({
      next: () => {
        this.mostrarMensaje('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.mostrarMensaje('Error en el registro, intente nuevamente');
      },
    });
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
