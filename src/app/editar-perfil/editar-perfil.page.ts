import { Component } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false
})
export class EditarPerfilPage {
  nombrePerfil: string = '';
  fotoPerfil: string = '';
  correoPerfil: string = '';
  nuevaContrasena: string = '';

  constructor(private usuarioService: UsuariosService, private router: Router) {
    const usuario = this.usuarioService.getUsuario();
    this.nombrePerfil = usuario?.user || 'Smith Johnson';
    this.fotoPerfil = usuario?.direccion || 'https://th.bing.com/th/id/OIP.DkKTae6dc5RumN3Gk0efGgHaH2?w=161&h=180&c=7&r=0&o=5&pid=1.7';
    this.correoPerfil = usuario?.correo || 'usuario@email.com';
  }

  async cambiarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    if (image.dataUrl) {
      this.fotoPerfil = image.dataUrl;
    }
  }

  guardarPerfil() {
    let usuario = this.usuarioService.getUsuario();
    if (usuario) {
      usuario.user = this.nombrePerfil;
      usuario.direccion = this.fotoPerfil;
      usuario.correo = this.correoPerfil;
      if (this.nuevaContrasena.trim() !== '') {
        usuario.contrasenia = this.nuevaContrasena;
      }
      this.usuarioService.setUsuario(usuario);
      this.usuarioService.saveCurrentUser();
    }
    this.router.navigateByUrl('/tabs/tab4', { replaceUrl: true });
  }

  navigateToTab4() {
    this.router.navigateByUrl('/tabs/tab4', { replaceUrl: true });
  }
}
