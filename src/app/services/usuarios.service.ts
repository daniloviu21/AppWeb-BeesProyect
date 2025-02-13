import { Injectable } from '@angular/core';

export interface Usuario {
  user: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuarios: Usuario[] = [
    {
      user: 'Juan',
      direccion: 'Av'
    }
  ]

  private usuarioActual: Usuario | null = null;

  authenticate(username: string): Usuario | null {
    const user = this.usuarios.find(u => u.user === username);
    if (user) {
      this.setUsuario(user);
      // Guarda el usuario actual en el almacenamiento local
    }
    return user || null;
  }

  getUsuario(): Usuario | null {
    return this.usuarioActual;
  }

  setUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
  }

  constructor() { }
}
