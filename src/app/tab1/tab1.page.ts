import { Component, Input } from '@angular/core';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  usuario!: Usuario;

  constructor(private userService: UsuariosService) {
    this.loadUsuario();
  }

  loadUsuario() {
    const usuario = this.userService.getUsuario();
    if (usuario) {
      this.usuario = usuario;
    } else {
      console.error('No hay un usuario autenticado.');
    }
  }

}
