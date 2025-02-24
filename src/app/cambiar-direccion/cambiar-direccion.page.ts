import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-cambiar-direccion',
  templateUrl: './cambiar-direccion.page.html',
  styleUrls: ['./cambiar-direccion.page.scss'],
  standalone: false
})
export class CambiarDireccionPage implements OnInit {

  direccionesGuardadas: any[] = [];

  constructor(private router: Router, private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.cargarDirecciones();
  }

  async cargarDirecciones() {
    const savedDireccion = localStorage.getItem('direccionGuardada');
    if (savedDireccion) {
      this.direccionesGuardadas.push(JSON.parse(savedDireccion));
    }
  }

  irAAgregarDireccion() {
    this.router.navigate(['/agregar-direccion']);
  }

  volverAInicio() {
    this.router.navigate(['/tabs/tab4']);
  }
}
