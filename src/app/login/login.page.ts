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

  login() {
    if (!this.username || !this.password) {
      this.mostrarMensaje('Todos los campos son obligatorios');
      return;
    }
    if (this.passwordError) {
      this.mostrarMensaje('Correo o Contraseña no válida');
      return;
    }
  
    this.usuariosService.login(this.username, this.password).subscribe(
      async (response) => {
        console.log('Inicio de sesión exitoso:', response);
        await this.usuariosService.setUsuario({
          usuario: response.usuario,
          token: response.token
        });
        this.router.navigate(['/tabs/tab1']);
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this.mostrarMensaje('Credenciales incorrectas');
      }
    );
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