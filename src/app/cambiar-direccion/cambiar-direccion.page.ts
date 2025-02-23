import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-cambiar-direccion',
  templateUrl: './cambiar-direccion.page.html',
  styleUrls: ['./cambiar-direccion.page.scss']
})
export class CambiarDireccionPage implements OnInit {

  direccion = {
    direccion: '',
    numInterior: '',
    numExterior: '',
    codigoPostal: '',
    localidad: '',
    telefono: '',
    ordenesEntrega: ''
  };

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.cargarDatosGuardados();
  }

  volverAInicio() {
    this.router.navigate(['/tabs/tab4']);
  }

  async agregarDireccion() {
    let usuario = this.usuariosService.getUsuario();
    if (usuario) {
      usuario.direccion = this.direccion.direccion;
      usuario.telefono = this.direccion.telefono;
      await this.usuariosService.saveCurrentUser();
      alert('Dirección guardada exitosamente');
    } else {
      alert('No hay usuario autenticado');
    }
  }

  async cargarDatosGuardados() {
    let usuario = this.usuariosService.getUsuario();
    if (usuario && usuario.direccion) {
      this.direccion.direccion = usuario.direccion;
      this.direccion.telefono = usuario.telefono || '';
    }
  }
}
