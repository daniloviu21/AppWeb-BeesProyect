import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
  standalone: false
})
export class TerminosCondicionesPage implements OnInit {
usuario!: Usuario | null;
correo: string = '';
mensaje: string = '';

router: any;

constructor(private alertCtrl: AlertController, private usuariosService: UsuariosService) {}
ngOnInit() {
}
}
