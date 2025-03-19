import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page {
  editando = false;
  nombrePerfil: string;
  fotoPerfil: string;

  constructor(public alertCtrl: AlertController, private router: Router, private usuarioService: UsuariosService) {
    const usuario = this.usuarioService.getUsuario() as Usuario | null;
    this.nombrePerfil = usuario?.usuario || 'Smith Johnson';
    this.fotoPerfil = usuario?.fotoPerfil || '/assets/icon/perfilvanguard.png';
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }

  async cambiarFoto() {
    if (!this.editando) return;

    const alert = await this.alertCtrl.create({
      header: 'Cambiar Foto',
      inputs: [{ name: 'url', type: 'url', placeholder: 'Pega la URL de la nueva imagen' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.url) {
              this.fotoPerfil = data.url;
              let usuario = this.usuarioService.getUsuario() as Usuario | null;
              if (usuario) {
                usuario.fotoPerfil = data.url; // Corregido: se guarda en fotoPerfil, no en direccion
                this.usuarioService.setUsuario(usuario);
                this.usuarioService.saveCurrentUser();
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  cambiarDireccion() {
    this.router.navigate(['/cambiar-direccion']);
  }

  metodosPago() {
    this.router.navigate(['/metodos-pago']);
  }

  politicaPrivacidad() {
    this.router.navigate(['/politica-privacidad']);
  }

  terminosCondiciones() {
    this.router.navigate(['/terminos-condiciones']);
  }

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Continuar',
          handler: () => {
            this.cerrarUser();
          }
        }
      ]
    });

    await alert.present();
  }

  cerrarUser() {
    const usuarioVacio: Usuario = {
      nombreCliente: '',
      apellidoP: '',
      apellidoM: '',
      telefono: '',
      correo: '',
      usuario: '',
      contrasenia: '',
      direccion: [],
      metodospago: [],
      fotoPerfil: 'https://th.bing.com/th?q=Pepe+Foto+De+Perfil&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=es-MX&cc=MX&setlang=es&adlt=moderate&t=1&mw=247'
    };

    this.usuarioService.setUsuario(usuarioVacio);
    this.usuarioService.saveCurrentUser();
    this.router.navigate(['/login']);
  }
}
