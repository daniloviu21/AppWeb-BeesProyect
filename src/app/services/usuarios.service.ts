import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Usuario {
  user: string;
  contrasenia: string;
  direccion: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private _storage: Storage | null = null;
  private usuarios: Usuario[] = [
    {
      user: 'a',
      contrasenia: "12",
      direccion: "av 21",
      correo: "ferleza@gmail.com"
    }
  ];
  private usuarioActual: Usuario | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.loadInitialData();
  }

  async authenticate(username: string, password: string): Promise<Usuario | null> {
    const user = this.usuarios.find(u => u.user === username && u.contrasenia === password);
    if (user) {
      this.setUsuario(user);
      await this.saveCurrentUser();
    }
    return user || null;
  }

  getUsuario(): Usuario | null {
    return this.usuarioActual;
  }

  setUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
  }

  addUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  async loadInitialData(): Promise<void> {
    await this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    if (!this._storage) return;
    const user = await this._storage.get('currentUser');
    this.usuarioActual = user ? (user as Usuario) : null;
  }

  async saveCurrentUser(): Promise<void> {
    if (this._storage && this.usuarioActual) {
      await this._storage.set('currentUser', this.usuarioActual);
    }
  }
}
