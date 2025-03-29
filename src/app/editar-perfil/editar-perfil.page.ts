import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
export class EditarPerfilPage implements OnInit {
  clienteId: number | null = null;
  nombreCliente: string = '';
  apellidoP: string = '';
  apellidoM: string = '';
  telefono: string = '';
  fotoPerfil: string = '/assets/icon/perfilvanguard.png';
  correo: string = '';
  cambiosRealizados: boolean = false;
  cargando: boolean = true;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.cargarDatosCliente();
  }

  async cargarDatosCliente() {
    this.cargando = true;
    try {
      const usuario = this.usuarioService.getUsuario();
      if (usuario && usuario.id) {
        // Obtener los datos del cliente usando el mismo ID
        const cliente = await this.usuarioService.obtenerClientePorId(usuario.id).toPromise();
        
        if (cliente) {
          this.clienteId = usuario.id;
          this.nombreCliente = cliente.nombrecliente || '';
          this.apellidoP = cliente.apellidop || '';
          this.apellidoM = cliente.apellidom || '';
          this.telefono = cliente.telefono || '';
          this.correo = cliente.correo || '';
          
          // La foto de perfil sigue siendo del usuario (manejo local)
          this.fotoPerfil = usuario.fotoPerfil || '/assets/icon/perfilvanguard.png';
        }
      }
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      this.mostrarAlerta('Error', 'No se pudieron cargar los datos del cliente');
    } finally {
      this.cargando = false;
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
    if (image.dataUrl) {
      this.fotoPerfil = image.dataUrl;
      this.cambiosRealizados = true;
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
        this.cambiosRealizados = true;
      };
      reader.readAsDataURL(file);
    }
  }

  onInputChange() {
    this.cambiosRealizados = true;
  }

  async guardarCambios() {
    if (!this.clienteId) return;
  
    // Validar campos obligatorios
    if (!this.nombreCliente || !this.apellidoP || !this.apellidoM) {
      this.mostrarAlerta('Error', 'Nombre y apellidos son campos obligatorios');
      return;
    }
  
    const datosActualizados = {
      nombreCliente: this.nombreCliente,
      apellidoP: this.apellidoP,
      apellidoM: this.apellidoM,
      correo: this.correo,
      telefono: this.telefono
    };
  
    try {
      // Usar el nuevo método con formato correcto
      await this.usuarioService.actualizarClienteConFormatoCorrecto(this.clienteId, datosActualizados);
      
      // Actualizar datos locales
      const usuario = this.usuarioService.getUsuario();
      if (usuario) {
        usuario.nombreCliente = this.nombreCliente;
        usuario.apellidoP = this.apellidoP;
        usuario.apellidoM = this.apellidoM;
        usuario.telefono = this.telefono;
        usuario.correo = this.correo;
        usuario.fotoPerfil = this.fotoPerfil;
        
        await this.usuarioService.actualizarUsuarioLocal(usuario);
      }
  
      this.mostrarAlerta('Éxito', 'Los cambios se guardaron correctamente');
      this.cambiosRealizados = false;
    } catch (error) {
      console.error('Error al actualizar:', error);
      this.mostrarAlerta('Error', (error as any).message || 'No se pudieron guardar los cambios');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarTelefono(event: any) {
    let valor = event.detail.value.replace(/\D/g, '').substring(0, 10);
    this.telefono = valor;
    this.onInputChange();
  }
}