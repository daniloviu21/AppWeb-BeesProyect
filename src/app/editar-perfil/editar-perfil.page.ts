import { Component, ViewChild, ElementRef } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';

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
  contrasenaPerfil: string = '';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private usuarioService: UsuariosService, private router: Router) {
    const usuario = this.usuarioService.getUsuario();
    this.nombrePerfil = usuario?.user || 'Smith Johnson';
    this.fotoPerfil = usuario?.direccion || 'https://th.bing.com/th/id/OIP.DkKTae6dc5RumN3Gk0efGgHaH2?w=161&h=180&c=7&r=0&o=5&pid=1.7';
    this.correoPerfil = usuario?.correo || '';
  }

  seleccionarImagen() {
    this.fileInput.nativeElement.click();
  }

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPerfil() {
    let usuario = this.usuarioService.getUsuario();
    if (usuario) {
      usuario.user = this.nombrePerfil;
      usuario.direccion = this.fotoPerfil;
      usuario.correo = this.correoPerfil;
      usuario.contrasenia = this.contrasenaPerfil || usuario.contrasenia;

      this.usuarioService.setUsuario(usuario);
      this.usuarioService.saveCurrentUser();
    }
    this.router.navigate(['/tabs/tab4']);
  }

  navigateToTab4() {
    this.router.navigate(['/tabs/tab4']);
  }
}
