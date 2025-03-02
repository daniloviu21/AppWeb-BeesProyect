import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-cambiar-direccion',
  templateUrl: './cambiar-direccion.page.html',
  styleUrls: ['./cambiar-direccion.page.scss'],
  standalone: false
})
export class CambiarDireccionPage implements OnInit {
  usuario!: Usuario | null;

  constructor(private router: Router, private usuarioService: UsuariosService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  irAAgregarDireccion() {
    this.router.navigate(['/agregar-direccion']);
  }

  volverAInicio() {
    this.router.navigate(['/tabs/tab4']);
  }

  editarDireccion(direccion: any) {
    localStorage.setItem('direccionAEditar', JSON.stringify(direccion));
    this.router.navigate(['/agregar-direccion']);
  }
}
