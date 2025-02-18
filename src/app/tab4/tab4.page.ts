import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page {
  darkMode = false;

  

  editarPerfil() {
    console.log("Editar perfil");
  }

  cambiarContraseña() {
    console.log("Cambiar contraseña");
  }

  metodosPago() {
    console.log("Métodos de pago");
  }

  politicaPrivacidad() {
    console.log("Política de privacidad");
  }

  terminosCondiciones() {
    console.log("Términos y condiciones");
  }

  cerrarSesion() {
    console.log("Cerrar sesión");
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
  }
  constructor( private navController: NavController ) { }

  navigateToLogin() {
    this.navController.navigateRoot('/login');
  }

}
