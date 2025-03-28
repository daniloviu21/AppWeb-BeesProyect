import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false
})
export class EditarPerfilPage implements OnInit, OnDestroy {
  usuario: string = '';
  nombreCliente: string = '';
  apellidoP: string = '';
  apellidoM: string = '';
  telefono: string = '';
  fotoPerfil: string = '';
  correo: string = '';
  modoEdicion: boolean = false;
  errores: { [key: string]: boolean } = {};
  tecladoActivo: boolean = false;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    Keyboard.addListener('keyboardWillShow', () => this.tecladoActivo = true);
    Keyboard.addListener('keyboardWillHide', () => this.tecladoActivo = false);
  }

  ngOnDestroy(): void {
    Keyboard.removeAllListeners();
  }

  cargarDatosUsuario(): void {
    const usuario = this.usuarioService.getUsuario();
    if (usuario) {
      this.usuario = usuario.usuario || '';
      this.nombreCliente = usuario.nombreCliente || '';
      this.apellidoP = usuario.apellidoP || '';
      this.apellidoM = usuario.apellidoM || '';
      this.telefono = usuario.telefono || '';
      this.fotoPerfil = usuario.fotoPerfil || '/assets/icon/perfilvanguard.png';
      this.correo = usuario.correo || '';
    }
  }

  async mostrarOpcionesFoto() {
    const alert = await this.alertController.create({
      header: 'Editar Foto de Perfil',
      buttons: [
        { text: 'Tomar Foto', handler: () => this.tomarFoto() },
        { text: 'Seleccionar de Galería', handler: () => this.seleccionarImagen() },
        { text: 'Cancelar', role: 'cancel' }
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
    if (image.dataUrl) this.fotoPerfil = image.dataUrl;
  }

  seleccionarImagen() {
    this.fileInput.nativeElement.click();
  }

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.fotoPerfil = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  habilitarEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  async guardarPerfil() {
    this.validarCampos();
    if (Object.values(this.errores).includes(true)) {
      this.mostrarAlerta("Corrige los campos resaltados antes de continuar.");
      return;
    }

    let usuario = this.usuarioService.getUsuario();
    if (usuario) {
      usuario.usuario = this.usuario;
      usuario.nombreCliente = this.nombreCliente;
      usuario.apellidoP = this.apellidoP;
      usuario.apellidoM = this.apellidoM;
      usuario.telefono = this.telefono;
      usuario.fotoPerfil = this.fotoPerfil;
      usuario.correo = this.correo;
      await this.usuarioService.actualizarUsuarioLocal(usuario);
    }
    this.modoEdicion = false;
    this.router.navigate(['/tabs/tab4']);
  }

  validarCampos() {
    this.errores = { nombre: false, apellidoP: false, apellidoM: false, telefono: false, correo: false };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this.usuario.length > 15) this.errores['nombre'] = true;
    if (this.apellidoP.length > 15) this.errores['apellidoP'] = true;
    if (this.apellidoM.length > 15) this.errores['apellidoM'] = true;
    if (!/^[0-9]{1,10}$/.test(this.telefono)) this.errores['telefono'] = true;
    if (!emailRegex.test(this.correo)) this.errores['correo'] = true;
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error de validación',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarTelefono(event: any) {
    let valor = event.detail.value.replace(/\D/g, '').substring(0, 10);
    this.telefono = valor;
  }

  navigateToTab4() {
    this.router.navigate(['/tabs/tab4']);
  }
}
