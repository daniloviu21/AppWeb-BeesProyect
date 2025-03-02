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
    ordenesEntrega: '',
    referencias: '',
    cp: '',
    estado: '',
    ciudad: '',
    correo: ''
  };
  editando = false;

  constructor(private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    const direccionAEditar = localStorage.getItem('direccionAEditar');
    if (direccionAEditar) {
      this.direccion = JSON.parse(direccionAEditar);
      this.editando = true;
      localStorage.removeItem('direccionAEditar'); // Limpiamos para evitar interferencias
    }
  }

  navigateToCambiarDireccion() {
    this.router.navigate(['/cambiar-direccion']);
  }

  async guardarDireccion() {
    let usuario = this.usuariosService.getUsuario();
    if (usuario) {
      usuario.direccion = usuario.direccion || [];
      
      // Revisamos si estamos editando una dirección existente
      const index = usuario.direccion.findIndex(dir => dir.direccion === this.direccion.direccion);
      if (index !== -1) {
        usuario.direccion[index] = { ...this.direccion }; // Editamos la dirección existente
      } else {
        usuario.direccion.push({ ...this.direccion }); // Agregamos una nueva dirección
      }

      await this.usuariosService.saveCurrentUser();
      alert(this.editando ? 'Dirección actualizada' : 'Dirección guardada');
      this.router.navigate(['/cambiar-direccion']);
    } else {
      alert('No hay usuario autenticado');
    }
  }
}
