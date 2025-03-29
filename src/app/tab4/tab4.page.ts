import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page implements OnInit{
  editando = false;
  nombrePerfil: string;
  fotoPerfil: string;

  constructor(public alertCtrl: AlertController, private router: Router, private usuarioService: UsuariosService) {
    const usuario = this.usuarioService.getUsuario() as Usuario | null;
    this.nombrePerfil = usuario?.usuario || 'Smith Johnson';
    this.fotoPerfil = usuario?.fotoPerfil || '/assets/icon/perfilvanguard.png';
  }

  async ngOnInit() {
    await this.cargarDatosUsuario();
  }

  async ionViewWillEnter() {
    await this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    const usuario = await this.usuarioService.getUsuario();
    if (usuario) {
      this.nombrePerfil = usuario.nombreCliente || usuario.usuario || 'Usuario';
      this.fotoPerfil = usuario.fotoPerfil || '/assets/icon/perfilvanguard.png';
    } else {
      this.nombrePerfil = 'Usuario';
      this.fotoPerfil = '/assets/icon/perfilvanguard.png';
    }
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
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

  async cerrarUser() {
    await this.usuarioService.logout();
    this.router.navigate(['/login']);
  }
}
