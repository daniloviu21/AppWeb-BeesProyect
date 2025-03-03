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
  this.usuario = this.usuariosService.getUsuario();
}
async enviarMensaje() {
  if (!this.correo || !this.mensaje) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Por favor, completa todos los campos.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const alert = await this.alertCtrl.create({
    header: 'Mensaje Enviado',
    message: `Tu mensaje ha sido enviado con éxito.`,
    buttons: ['OK']
  });
  await alert.present();

  this.correo = '';
  this.mensaje = '';
}
}
