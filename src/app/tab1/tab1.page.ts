import { Component, Input } from '@angular/core';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  usuario!: Usuario | null;
  @Input() cartCount: number = 0;

  constructor(private usuariosService: UsuariosService) {
    this.usuario = usuariosService.getUsuario();
  }
}