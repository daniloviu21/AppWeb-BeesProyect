import { Component } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showSplash = true;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setOverlaysWebView({ overlay: false }); 
      StatusBar.setBackgroundColor({ color: '#090C15' });
    });

    const token = await this.usuariosService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    }
  }
}
