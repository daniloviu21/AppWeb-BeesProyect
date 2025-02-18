import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page {
  editando = false;
  nombrePerfil = localStorage.getItem('nombrePerfil') || 'Smith Johnson';
  fotoPerfil = localStorage.getItem('fotoPerfil') || 'https://th.bing.com/th/id/OIP.DkKTae6dc5RumN3Gk0efGgHaH2?w=161&h=180&c=7&r=0&o=5&pid=1.7';

  constructor(private alertCtrl: AlertController, private router: Router) {}

  editarPerfil() {
    if (this.editando) {
      localStorage.setItem('nombrePerfil', this.nombrePerfil);
    }
    this.editando = !this.editando;
  }

  async cambiarFoto() {
    if (!this.editando) return;

    const alert = await this.alertCtrl.create({
      header: 'Cambiar Foto',
      inputs: [
        { name: 'url', type: 'url', placeholder: 'Pega la URL de la nueva imagen' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.url) {
              this.fotoPerfil = data.url;
              localStorage.setItem('fotoPerfil', data.url);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  cambiarDireccion() { console.log("Cambiar dirección"); }
  metodosPago() { console.log("Métodos de pago"); }
  politicaPrivacidad() { console.log("Política de privacidad"); }
  terminosCondiciones() { console.log("Términos y condiciones"); }

  cerrarSesion() {
    localStorage.removeItem('token'); // Elimina el token de autenticación
    this.router.navigate(['/login']); // Redirige al login
  }
}
