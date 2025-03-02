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
  errorCP: boolean = false;
  errorTelefono: boolean = false;

  constructor(private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    const direccionAEditar = localStorage.getItem('direccionAEditar');
    if (direccionAEditar) {
      this.direccion = JSON.parse(direccionAEditar);
      this.editando = true;
      localStorage.removeItem('direccionAEditar');
    }
  }

  navigateToCambiarDireccion() {
    this.router.navigate(['/cambiar-direccion']);
  }

  telefonoValido(telefono: string): boolean {
    return /^\d{10}$/.test(telefono);
  }

  codigoPostalValido(cp: string): boolean {
    return /^\d{5}$/.test(cp);
  }

  // Funciones de validación
  validarTelefono() {
    this.errorTelefono = !this.telefonoValido(this.direccion.telefono);
  }

  validarCP() {
    this.errorCP = !this.codigoPostalValido(this.direccion.cp);
  }

  // Función para guardar la dirección
  async guardarDireccion() {
    this.validarTelefono();
    this.validarCP();

    if (this.errorTelefono) {
      alert('El teléfono debe contener exactamente 10 números.');
      return;
    }

    if (this.errorCP) {
      alert('El código postal debe contener exactamente 5 números.');
      return;
    }

    let usuario = this.usuariosService.getUsuario();
    if (usuario) {
      usuario.direccion = usuario.direccion || [];

      // Revisamos si estamos editando una dirección existente
      const index = usuario.direccion.findIndex(dir => dir.direccion === this.direccion.direccion);
      if (index !== -1) {
        usuario.direccion[index] = { ...this.direccion };
      } else {
        usuario.direccion.push({ ...this.direccion });
      }

      await this.usuariosService.saveCurrentUser();
      alert(this.editando ? 'Dirección actualizada' : 'Dirección guardada');
      this.router.navigate(['/cambiar-direccion']);
    } else {
      alert('No hay usuario autenticado');
    }
  }
}
