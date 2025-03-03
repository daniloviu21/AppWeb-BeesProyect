import { Component, ViewChild, ElementRef } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false
})
export class EditarPerfilPage {
  nombrePerfil: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  telefonoPerfil: string = '';
  fotoPerfil: string = '';
  correoPerfil: string = '';
  modoEdicion: boolean = false;
  errores: { [key: string]: boolean } = {};


  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private alertController: AlertController
  ) {
    const usuario = this.usuarioService.getUsuario();
    this.nombrePerfil = usuario?.user || 'Smith Johnson';
    this.apellidoPaterno = usuario?.apellidoPaterno || '';
    this.apellidoMaterno = usuario?.apellidoMaterno || '';
    this.telefonoPerfil = usuario?.telefono || '';
    this.fotoPerfil = usuario?.user || '/assets/icon/perfilvanguard.png';
    this.correoPerfil = usuario?.correo || '';
  }

  async mostrarOpcionesFoto() {
    const alert = await this.alertController.create({
      header: 'Editar Foto de Perfil',
      buttons: [
        {
          text: 'Tomar Foto',
          handler: () => {
            this.tomarFoto();
          }
        },
        {
          text: 'Seleccionar de Galería',
          handler: () => {
            this.seleccionarImagen();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    if (image.dataUrl) {
      this.fotoPerfil = image.dataUrl;
    }
  }

  seleccionarImagen() {
    this.fileInput.nativeElement.click();
  }

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  habilitarEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  guardarPerfil() {
    // Limpiar errores previos
    this.errores = { nombre: false, apellidoPaterno: false, apellidoMaterno: false, telefono: false, correo: false };
  
    // Expresión regular para validar el correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Validaciones
    if (this.nombrePerfil.length > 15) {
      this.errores['nombre'] = true;
    }
    if (this.apellidoPaterno.length > 15) {
      this.errores['apellidoPaterno'] = true;
    }
    if (this.apellidoMaterno.length > 15) {
      this.errores['apellidoMaterno'] = true;
    }
    if (!/^\d{1,10}$/.test(this.telefonoPerfil)) {
      this.errores['telefono'] = true;
    }
    if (!emailRegex.test(this.correoPerfil)) {
      this.errores['correo'] = true;
    }
  
    // Si hay algún error, mostrar alerta y salir
    if (Object.values(this.errores).includes(true)) {
      this.mostrarAlerta("Corrige los campos resaltados antes de continuar.");
      return;
    }
  
    // Guardar datos si todo es válido
    let usuario = this.usuarioService.getUsuario();
    if (usuario) {
      usuario.user = this.nombrePerfil;
      usuario.apellidoPaterno = this.apellidoPaterno;
      usuario.apellidoMaterno = this.apellidoMaterno;
      usuario.telefono = this.telefonoPerfil;
      usuario.user = this.fotoPerfil;
      usuario.correo = this.correoPerfil;
      this.usuarioService.setUsuario(usuario);
      this.usuarioService.saveCurrentUser();
    }
    this.modoEdicion = false;
    this.router.navigate(['/tabs/tab4']);
  }
  
  // Método para mostrar alerta
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error de validación',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  validarTelefono(event: any) {
    let valor = event.detail.value;
    
    // Remover caracteres no numéricos
    valor = valor.replace(/\D/g, '');
  
    // Limitar a 10 caracteres
    if (valor.length > 10) {
      valor = valor.substring(0, 10);
    }
  
    this.telefonoPerfil = valor;
  }
  
  
  navigateToTab4() {
    this.router.navigate(['/tabs/tab4']);
  }
}
