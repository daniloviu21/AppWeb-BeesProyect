import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';

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
    private alertController: AlertController,
    private loadingController: LoadingController
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
      resultType: CameraResultType.Base64, // Cambiamos a Base64 para almacenamiento local
      source: CameraSource.Camera
    });
    
    if (image.base64String) {
      this.fotoPerfil = `data:image/jpeg;base64,${image.base64String}`;
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
    if (!this.clienteId) {
      this.mostrarAlerta('Error', 'No se ha identificado el cliente');
      return;
    }
  
    try {
      // Validación de campos
      if (!this.nombreCliente.trim() || !this.apellidoP.trim() || !this.apellidoM.trim()) {
        this.mostrarAlerta('Error', 'Nombre y apellidos son obligatorios');
        return;
      }
  
      const loading = await this.mostrarLoading('Guardando cambios...');
      
      try {
        // Solo envía datos básicos al backend (sin la foto)
        const datosActualizados = {
          nombreCliente: this.nombreCliente.trim(),
          apellidoP: this.apellidoP.trim(),
          apellidoM: this.apellidoM.trim(),
          correo: this.correo.trim() || '',
          telefono: this.telefono.trim() || ''
        };
  
        await this.usuarioService.actualizarSoloCliente(this.clienteId, datosActualizados);
        
        // Actualizar datos locales incluyendo la foto (solo en localStorage)
        const usuario = this.usuarioService.getUsuario();
        if (usuario) {
          usuario.nombreCliente = datosActualizados.nombreCliente;
          usuario.apellidoP = datosActualizados.apellidoP;
          usuario.apellidoM = datosActualizados.apellidoM;
          usuario.telefono = datosActualizados.telefono;
          usuario.correo = datosActualizados.correo;
          usuario.fotoPerfil = this.fotoPerfil; // Guardamos la foto solo localmente
          
          await this.usuarioService.actualizarUsuarioLocal(usuario);
        }
  
        await loading.dismiss();
        this.mostrarAlerta('Éxito', 'Perfil actualizado correctamente');
        this.cambiosRealizados = false;
        this.router.navigate(['/tabs/tab4']);
  
      } catch (error) {
        await loading.dismiss();
        throw error;
      }
  
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      this.mostrarAlerta('Error', (error as Error).message || 'Error al actualizar el perfil');
    }
  }

  async mostrarLoading(mensaje: string): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: mensaje,
      spinner: 'crescent',
      translucent: true,
      backdropDismiss: false
    });
    await loading.present();
    return loading;
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