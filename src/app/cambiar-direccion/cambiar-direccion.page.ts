import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Direccion, Usuario, UsuariosService } from '../services/usuarios.service';
import { NavController, ToastController, AlertController } from '@ionic/angular';

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
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {}

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
        // Filtrar solo direcciones con deleted_at null
        this.direcciones = direcciones.filter(d => d.deleted_at === null);
        if (this.direcciones.length > 0) {
          this.direccionSeleccionada = this.direcciones[this.direcciones.length-1];
        }
        console.log('Direcciones cargadas:', this.direcciones);
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

  async borrarDireccion(direccion: Direccion) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar dirección',
      message: '¿Estás seguro de que quieres eliminar esta dirección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            if (direccion.id) {
              this.usuarioService.eliminarDireccion(direccion.id).subscribe(
                () => {
                  this.mostrarToast('Dirección eliminada correctamente', 'success');
                  // Recargar las direcciones después de eliminar
                  if (this.usuario?.id) {
                    this.cargarDirecciones(this.usuario.id);
                  }
                },
                (error) => {
                  console.error('Error al eliminar la dirección:', error);
                  this.mostrarToast('Error al eliminar la dirección', 'danger');
                }
              );
            }
          }
        }
      ]
    });

    await alert.present();
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