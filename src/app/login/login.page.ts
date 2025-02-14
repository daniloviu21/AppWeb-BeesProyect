import { Component, OnInit } from '@angular/core';
import { Usuario, UsuariosService } from '../services/usuarios.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';

  usuario!: Usuario | null;

  constructor( private usuariosService: UsuariosService, private navCtrl: NavController ) {}

  ngOnInit() {
  }

  async login() {
    if (!this.username || !this.password) {
      console.log("Ingrese algoooooooo");
      return;
    }
  
    const user = await this.usuariosService.authenticate(this.username, this.password);
  
    if (user) {
      console.log('Inicio de sesión exitoso', user);
      this.usuariosService.setUsuario(user);
      this.navCtrl.navigateForward('/tabs');
    } else {
      console.log('Credenciales incorrectas');
    }
  }
  

}
