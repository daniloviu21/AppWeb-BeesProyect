import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.page.html',
  styleUrls: ['./agregar-direccion.page.scss'],
  standalone: false
})
export class AgregarDireccionPage implements OnInit {
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

  ngOnInit(): void {
    const savedDireccion = localStorage.getItem('direccionGuardada');
    if (savedDireccion) {
      this.direccion = JSON.parse(savedDireccion);
    }
  }

  navigateToCambiarDireccion() {
    this.router.navigate(['/cambiar-direccion']);
  }

  async agregarDireccion() {
    let usuario = this.usuariosService.getUsuario();
    if (usuario) {
      usuario.direccion = this.direccion.direccion;
      usuario.telefono = this.direccion.telefono;
      await this.usuariosService.saveCurrentUser();
      
      // Guardar en localStorage
      localStorage.setItem('direccionGuardada', JSON.stringify(this.direccion));
      
      alert('Dirección guardada exitosamente');
      this.router.navigate(['/cambiar-direccion']);
    } else {
      alert('No hay usuario autenticado');
    }
  }
}
