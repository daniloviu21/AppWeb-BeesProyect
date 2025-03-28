import { Component } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const token = await this.usuariosService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    }
  }
}
