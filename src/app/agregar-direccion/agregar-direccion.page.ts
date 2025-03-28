import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService, Direccion } from '../services/usuarios.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.page.html',
  styleUrls: ['./agregar-direccion.page.scss'],
  standalone: false,
})
export class AgregarDireccionPage implements OnInit {
  direccion: Direccion = {
    calle: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
  };

  editando = false;
  errorCP: boolean = false;
  errorTelefono: boolean = false;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private toastController: ToastController
  ) {}

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

  validarCP() {
    this.errorCP = !this.codigoPostalValido(this.direccion.codigoPostal);
  }

  async guardarDireccion() {
    this.validarCP();

    if (this.errorTelefono) {
      this.mostrarToast('El teléfono debe contener exactamente 10 números.', 'danger');
      return;
    }

    if (this.errorCP) {
      this.mostrarToast('El código postal debe contener exactamente 5 números.', 'danger');
      return;
    }

    const usuario = this.usuariosService.getUsuario();
    if (usuario && usuario.id) {
      try {
        if (this.editando && this.direccion.id) {
          // Editar dirección existente
          await this.usuariosService.editarDireccion(this.direccion.id, this.direccion).toPromise();
          this.mostrarToast('Dirección actualizada correctamente', 'success');
        } else {
          // Agregar nueva dirección
          await this.usuariosService.agregarDireccion(usuario.id, this.direccion).toPromise();
          this.mostrarToast('Dirección guardada correctamente', 'success');
        }
        this.router.navigate(['/cambiar-direccion']);
      } catch (error) {
        console.error('Error al guardar la dirección:', error);
        this.mostrarToast('Error al guardar la dirección', 'danger');
      }
    } else {
      this.mostrarToast('No hay usuario autenticado', 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: string = 'danger', duracion: number = 2000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}