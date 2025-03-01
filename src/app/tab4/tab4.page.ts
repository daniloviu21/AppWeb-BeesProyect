import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page {
  editando = false;
  nombrePerfil = localStorage.getItem('nombrePerfil') || 'Smith Johnson';
  fotoPerfil = localStorage.getItem('fotoPerfil') || 'https://th.bing.com/th/id/OIP.DkKTae6dc5RumN3Gk0efGgHaH2?w=161&h=180&c=7&r=0&o=5&pid=1.7';

  constructor(public alertCtrl: AlertController, private router: Router, private usuarioService: UsuariosService) {
    const usuario = this.usuarioService.getUsuario();
    this.nombrePerfil = usuario?.user || 'Smith Johnson';
    this.fotoPerfil = usuario?.user || 'https://th.bing.com/th/id/OIP.DkKTae6dc5RumN3Gk0efGgHaH2?w=161&h=180&c=7&r=0&o=5&pid=1.7';
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
              let usuario = this.usuarioService.getUsuario();
              if (usuario) {
                usuario.direccion = data.url;
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
 cambiarDireccion() { this.router.navigate(['/cambiar-direccion']); }




  metodosPago() { this.router.navigate(['/metodos-pago']); }
  politicaPrivacidad() { this.router.navigate(['/politica-privacidad']); }
  terminosCondiciones() { this.router.navigate(['/terminos-condiciones']); }
  
  cerrarSesion() {
    this.usuarioService.setUsuario({ user: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      direccion: [],
      correo: '',
      contrasenia: '',
      metodospago: [] }); // Usuario vacío en lugar de null
    this.usuarioService.setUsuario({
      user: '', contrasenia: '', direccion: [], correo: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      metodospago: []
    }); // Usuario vacío en lugar de null

    this.router.navigate(['/login']);
  }
  
  
  
}
