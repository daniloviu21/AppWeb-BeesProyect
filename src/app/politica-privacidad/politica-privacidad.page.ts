import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.page.html',
  styleUrls: ['./politica-privacidad.page.scss'],
  standalone: false
})
export class PoliticaPrivacidadPage implements OnInit {

  usuario!: Usuario | null;

  constructor(private router: Router, private usuariosService: UsuariosService) {}
  ngOnInit() {
    this.usuario = this.usuariosService.getUsuario();
  }

  volverATab4() {
    this.router.navigate(['/tabs/tab4']);
  }

}
