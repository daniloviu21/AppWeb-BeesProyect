import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  username: string = '';
  password: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;

  usuario!: Usuario | null;

  constructor(private toastController: ToastController, private router: Router, private usuariosService: UsuariosService) { }

  validarPassword() {
    this.passwordError = this.password.length > 0 && this.password.length < 6;
  }

  async login() {
    if (!this.username || !this.password) {
      this.mostrarMensaje('Todos los campos son obligatorios');
      return;
    }
    if (this.passwordError) {
      this.mostrarMensaje('Correo o Contraseña no válida');
      return;
    }

    const user = await this.usuariosService.authenticate(this.username, this.password);
  
    if (user) {
      console.log('Inicio de sesión exitoso', user);
      this.usuariosService.setUsuario(user);
      this.router.navigate(['/tabs/tab1']);
    } else {
      console.log('Credenciales incorrectas');
    }

    // this.mostrarMensaje('Inicio de sesión exitoso');
    // this.router.navigate(['/tabs/tab1']);
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
