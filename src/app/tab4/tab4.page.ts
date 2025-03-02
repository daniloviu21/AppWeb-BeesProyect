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
  fotoPerfil = localStorage.getItem('fotoPerfil') || '/assets/icon/perfilvanguard.png';

  constructor(public alertCtrl: AlertController, private router: Router, private usuarioService: UsuariosService) {
    const usuario = this.usuarioService.getUsuario();
    this.nombrePerfil = usuario?.user || 'Smith Johnson';
    this.fotoPerfil = usuario?.user || '/assets/icon/perfilvanguard.png';
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
    this.usuarioService.setUsuario({
      user: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      direccion: [],
      correo: '',
      contrasenia: '',
      metodospago: [],
      fotoPerfil: 'https://th.bing.com/th?q=Pepe+Foto+De+Perfil&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=es-MX&cc=MX&setlang=es&adlt=moderate&t=1&mw=247' // Agregar para evitar posibles errores
    });
  
    this.usuarioService.saveCurrentUser(); // Guardar cambios en almacenamiento
    this.router.navigate(['/login']);
  }
  
  
  
  
}
