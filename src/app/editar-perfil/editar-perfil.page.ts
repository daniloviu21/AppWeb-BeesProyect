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
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  telefonoPerfil: string = '';
  fotoPerfil: string = '';
  correoPerfil: string = '';
  modoEdicion: boolean = false;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private usuarioService: UsuariosService, private router: Router) {
    const usuario = this.usuarioService.getUsuario();
    this.nombrePerfil = usuario?.user || 'Smith Johnson';
    this.apellidoPaterno = usuario?.apellidoPaterno || '';
    this.apellidoMaterno = usuario?.apellidoMaterno || '';
    this.telefonoPerfil = usuario?.telefono || '';
    this.fotoPerfil = usuario?.user || '/assets/icon/perfilvanguard.png';
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

  habilitarEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  guardarPerfil() {
    let usuario = this.usuarioService.getUsuario();
    if (usuario) {
      usuario.user = this.nombrePerfil;
      usuario.apellidoPaterno = this.apellidoPaterno;
      usuario.apellidoMaterno = this.apellidoMaterno;
      usuario.telefono = this.telefonoPerfil;
      usuario.user = this.fotoPerfil;
      usuario.correo = this.correoPerfil;

      this.usuarioService.setUsuario(usuario);
      this.usuarioService.saveCurrentUser();
    }
    this.modoEdicion = false;
    this.router.navigate(['/tabs/tab4']);
  }

  navigateToTab4() {
    this.router.navigate(['/tabs/tab4']);
  }
}
