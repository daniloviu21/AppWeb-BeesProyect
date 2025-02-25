import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
  standalone: false
})
export class TerminosCondicionesPage implements OnInit {
 correo: string = '';
  mensaje: string = '';
  router: any;

  constructor(private alertCtrl: AlertController) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
  
  volverATab4() {
    this.router.navigate(['/tabs/tab4']);
  }

}

