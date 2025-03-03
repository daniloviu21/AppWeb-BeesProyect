import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Usuario {
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
  contrasenia?: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private _storage: Storage | null = null;
  private usuarios: Usuario[] = [
    {
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
          telefono: '5512345678'
        },
        {
          direccion: 'Calle 16 de Septiembre #45, Col. Centro',
          referencias: 'A una cuadra del parque principal',
          cp: '91700',
          estado: 'Veracruz',
          ciudad: 'Cordoba',
          telefono: '2298765432'
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
    },
    {
      user: 'juanperez',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Gómez',
      telefono: '5551234567',
      correo: "juanperez@gmail.com",
      contrasenia: '654321',
      direccion: [
        {
          direccion: 'Calle Reforma #789, Col. Juárez',
          referencias: 'Cerca del monumento a la independencia',
          cp: '06600',
          estado: 'Ciudad de México',
          ciudad: 'Cuauhtémoc',
          telefono: '5559876543'
        }
      ],
      metodospago: [
        {
          tipo: 'Visa',
          numero: '4929123456789012',
          fechav: '12/2025',
          cvv: '123'
        }
      ]
    },
    {
      user: 'mariagarcia',
      apellidoPaterno: 'García',
      apellidoMaterno: 'López',
      telefono: '5558765432',
      correo: "mariagarcia@gmail.com",
      contrasenia: '987654',
      direccion: [
        {
          direccion: 'Av. Hidalgo #456, Col. Centro',
          referencias: 'Frente al teatro principal',
          cp: '58000',
          estado: 'Michoacán',
          ciudad: 'Morelia',
          telefono: '4431234567'
        },
        {
          direccion: 'Calle Allende #321, Col. San Miguel',
          referencias: 'Junto al mercado municipal',
          cp: '58200',
          estado: 'Michoacán',
          ciudad: 'Morelia',
          telefono: '4439876543'
        }
      ],
      metodospago: [
        {
          tipo: 'American Express',
          numero: '378282246310005',
          fechav: '06/2026',
          cvv: '4567'
        },
        {
          tipo: 'Mastercard',
          numero: '5555555555554444',
          fechav: '09/2024',
          cvv: '789'
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

  actualizarDireccionPrincipal(user: string, nuevaDireccion: Direccion): void {
    const usuario = this.usuarios.find(u => u.user === user);
    if (usuario) {
      usuario.direccion = usuario.direccion.filter(d => d !== nuevaDireccion);
      usuario.direccion.unshift(nuevaDireccion);
      this.saveUsuarios();
    }
  }

  actualizarMetodoPagoPrincipal(user: string, metodo: MetodosPago): void {
    const usuario = this.usuarios.find(u => u.user === user);
    if (usuario) {
      usuario.metodospago = usuario.metodospago.filter(mpago => mpago !== metodo);
      usuario.metodospago.unshift(metodo);
      this.saveUsuarios();
    }
  }
}
