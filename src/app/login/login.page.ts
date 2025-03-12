import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  usuario!: Usuario | null;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    // Agregar listeners del teclado
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });

    Keyboard.addListener('keyboardDidHide', () => {
      document.body.classList.remove('keyboard-open');
    });
    
  }
  moverCampoArriba(event: any) {
    setTimeout(() => {
      event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300); // Esperar un poco para que el teclado aparezca
  }
  validarPassword() {
    this.passwordError = !!this.password && this.password.length > 0 && this.password.length < 6;
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

    this.usuario = await this.usuariosService.authenticate(this.username, this.password);

    if (this.usuario) {
      console.log('Inicio de sesión exitoso', this.usuario);
      this.usuariosService.setUsuario(this.usuario);
      this.router.navigate(['/tabs/tab1']);
    } else {
      console.log('Credenciales incorrectas');
      this.mostrarMensaje('Credenciales incorrectas');
    }
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
