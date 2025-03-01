import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Usuario {
  usuario: string;
  user: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  direccion: Direccion[];
  correo: string;
  contrasenia: string;
  metodospago: MetodosPago[];
  fotoPerfil?: string;
}

export interface MetodosPago {
  tipo: string;
  numero: string;
  fechav: string;
  cvv: string;
}

export interface Direccion {
  direccion: string;
  referencias: string;
  cp: string;
  estado: string;
  ciudad: string;
  telefono: string;
  correo: string;
  contrasenia?: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private _storage: Storage | null = null;
  private usuarios: Usuario[] = [
    {
      usuario: 'ferleza', // Agregado porque en la interfaz Usuario está definido
      user: 'a',
      apellidoPaterno: 'b',
      apellidoMaterno: 'c',
      telefono: '2711764235',
      correo: 'ferleza@gmail.com',
      contrasenia: '123456',
      direccion: [
        {
          direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle',
          referencias: 'Frente a la plaza comercial, junto al banco',
          cp: '03100',
          estado: 'Ciudad de México',
          ciudad: 'Benito Juárez',
          telefono: '5512345678',
          correo: 'ferleza@gmail.com'
        },
        {
          direccion: 'Calle 16 de Septiembre #45, Col. Centro',
          referencias: 'A una cuadra del parque principal',
          cp: '91700',
          estado: 'Veracruz',
          ciudad: 'Cordoba',
          telefono: '2298765432',
          correo: 'ferleza@gmail.com'
        }
      ],
      metodospago: [
        {
          tipo: 'Mastercard',
          numero: '5446141698436543',
          fechav: '01/2024',
          cvv: '526'
        },
        {
          tipo: 'Visa',
          numero: '4169141698432346',
          fechav: '01/2023',
          cvv: '168'
        }
      ]
    }
  ];
  private usuarioActual: Usuario | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    await this.loadInitialData();
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
    this.saveUsuarios(); // Guarda la lista de usuarios en el almacenamiento
  }

  async saveUsuarios(): Promise<void> {
    if (this._storage) {
      await this._storage.set('usuarios', this.usuarios);
    }
  }

  async loadInitialData(): Promise<void> {
    await this.loadUsuarios();
    await this.loadCurrentUser();
  }

  async loadUsuarios(): Promise<void> {
    if (!this._storage) return;
    const storedUsers = await this._storage.get('usuarios');
    if (storedUsers) {
      this.usuarios = storedUsers;
    }
  }

  async loadCurrentUser(): Promise<void> {
    if (!this._storage) return;
    const user = await this._storage.get('currentUser');
    this.usuarioActual = user ?? null; // Si no hay usuario guardado, deja `null`
  }

  async saveCurrentUser(): Promise<void> {
    if (this._storage && this.usuarioActual) {
      await this._storage.set('currentUser', this.usuarioActual);
    }
  }
}
