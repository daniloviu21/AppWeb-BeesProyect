import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-cambiar-direccion',
  templateUrl: './cambiar-direccion.page.html',
  styleUrls: ['./cambiar-direccion.page.scss'],
  standalone: false
})
export class CambiarDireccionPage implements OnInit {

  direccionesGuardadas: any[] = [];

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.cargarDirecciones();
  }

  async cargarDirecciones() {
    const usuario = this.usuariosService.getUsuario();
    if (usuario && usuario.direccion) {
      this.direccionesGuardadas.push({
        direccion: usuario.direccion,
        telefono: usuario.telefono || 'Sin teléfono'
      });
    }
  }

  irAAgregarDireccion() {
    this.router.navigate(['/agregar-direccion']); // Redirige a la pantalla de agregar dirección
  }
  volverAInicio() {
    this.router.navigate(['/tabs/tab4']);
  }
}
