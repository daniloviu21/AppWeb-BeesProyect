import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Direccion, Usuario, UsuariosService } from '../services/usuarios.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-direccion',
  templateUrl: './cambiar-direccion.page.html',
  styleUrls: ['./cambiar-direccion.page.scss'],
  standalone: false,
})
export class CambiarDireccionPage {
  usuario!: Usuario | null;
  direccionSeleccionada!: Direccion;
  direcciones: Direccion[] = []; // Lista de direcciones

  constructor(
    private router: Router,
    private usuarioService: UsuariosService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  // Este evento se ejecuta cada vez que la página está a punto de mostrarse
  ionViewWillEnter() {
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario?.id) {
      this.cargarDirecciones(this.usuario.id);
    } else {
      console.error('Usuario no autenticado o ID no definido');
    }
  }

  cargarDirecciones(idCliente: number) {
    this.usuarioService.obtenerDirecciones(idCliente).subscribe(
      (direcciones) => {
        this.direcciones = direcciones;
        if (direcciones.length > 0) {
          this.direccionSeleccionada = direcciones[direcciones.length-1]; // Selecciona la primera dirección por defecto
        }
        console.log('Direcciones cargadas:', this.direcciones); // Verifica los datos recibidos
      },
      (error) => {
        console.error('Error al cargar direcciones:', error);
      }
    );
  }

  irAAgregarDireccion() {
    this.router.navigate(['/agregar-direccion']);
  }

  volverAInicio() {
    this.router.navigate(['/tabs/tab4']);
  }

  editarDireccion(direccion: Direccion) {
    localStorage.setItem('direccionAEditar', JSON.stringify(direccion));
    this.router.navigate(['/agregar-direccion']);
  }

  guardarDireccionPrincipal() {
    if (this.usuario && this.direccionSeleccionada && this.direccionSeleccionada.id) {
      this.usuarioService.editarDireccion(this.direccionSeleccionada.id, this.direccionSeleccionada).subscribe(
        (direccionActualizada) => {
          console.log('Dirección actualizada:', direccionActualizada);
          this.mostrarToast('Dirección principal actualizada correctamente', 'success');
        },
        (error) => {
          console.error('Error al actualizar la dirección:', error);
          this.mostrarToast('Error al actualizar la dirección', 'danger');
        }
      );
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

  regresar() {
    this.navCtrl.back();
  }
}