import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Direccion, Usuario, UsuariosService } from '../services/usuarios.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-direccion',
  templateUrl: './cambiar-direccion.page.html',
  styleUrls: ['./cambiar-direccion.page.scss'],
  standalone: false
})
export class CambiarDireccionPage implements OnInit {
  usuario!: Usuario | null;
  direccionSeleccionada!: Direccion;

  constructor(private router: Router, private usuarioService: UsuariosService, private navCtrl: NavController) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario && this.usuario.direccion.length > 0) {
      this.direccionSeleccionada = this.usuario.direccion[0];
    }
  }

  irAAgregarDireccion() {
    this.router.navigate(['/agregar-direccion']);
  }

  volverAInicio() {
    this.router.navigate(['/tabs/tab4']);
  }

  editarDireccion(direccion: any) {
    localStorage.setItem('direccionAEditar', JSON.stringify(direccion));
    this.router.navigate(['/agregar-direccion']);
  }

  guardarDireccionPrincipal() {
    if (this.usuario) {
      this.usuarioService.actualizarDireccionPrincipal(this.usuario.user, this.direccionSeleccionada);
    }
  }

  regresar() {
    this.navCtrl.back();
  }
}
