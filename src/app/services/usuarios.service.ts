import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Usuario {
  id?: number;
  nombreCliente: string;
  apellidoP: string;
  apellidoM: string;
  correo: string;
  telefono: string;
  usuario: string;
  contrasenia: string;
  direccion: Direccion[];
  metodospago: MetodosPago[];
  fotoPerfil?: string;
}

export interface MetodosPago {
  id?: number; // Agrega esta línea
  tipo: string;
  numeroTarjeta: string;
  fechaVencimiento: string;
  cvv: string;
}

export interface Direccion {
  id?: number; // Agrega esta línea
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private _storage: Storage | null = null;
  private apiUrl = environment.apiUrl;
  private usuarioActual: Usuario | null = null;
  private token: string | null = null;

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    await this.loadCurrentUser();
    await this.loadToken();
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
    if (this._storage) {
      await this._storage.set('authToken', token);
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token && this._storage) {
      this.token = await this._storage.get('authToken');
    }
    return this.token;
  }

  async removeToken(): Promise<void> {
    this.token = null;
    if (this._storage) {
      await this._storage.remove('authToken');
    }
  }

  async loadToken(): Promise<void> {
    if (this._storage) {
      this.token = await this._storage.get('authToken');
    }
  }

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  // Crear un nuevo usuario
  crearClienteYUsuario(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes`, requestBody);
  }
  

  // Obtener un usuario por su ID
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  // Actualizar un usuario por su ID
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  // Eliminar un usuario por su ID
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  // Iniciar sesión
  login(username: string, password: string): Observable<{ message: string; usuario: Usuario; token: string }> {
    return this.http.post<{ message: string; usuario: Usuario; token: string }>(`${this.apiUrl}/usuarios/login`, {
      username,
      password,
    });
  }

  // Guardar el usuario actual en el almacenamiento local
  async setUsuario(data: { usuario: Usuario; token?: string }): Promise<void> {
    this.usuarioActual = data.usuario;
    if (data.token) {
      await this.setToken(data.token);
    }
    await this.saveCurrentUser();
  }

  async actualizarUsuarioLocal(usuario: Usuario): Promise<void> {
    this.usuarioActual = usuario;
    await this.saveCurrentUser();
  }

  // Obtener el usuario actual
  getUsuario(): Usuario | null {
    return this.usuarioActual;
  }

  // Modificar el logout
  async logout(): Promise<void> {
    this.usuarioActual = null;
    await this.removeToken();
    await this.saveCurrentUser();
  }

  // Método para verificar autenticación
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Interceptor para añadir el token a las peticiones
  getAuthHeader(): { [header: string]: string } {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // Cargar el usuario actual desde el almacenamiento local
  async loadCurrentUser(): Promise<void> {
    if (!this._storage) return;
    const user = await this._storage.get('currentUser');
    this.usuarioActual = user ?? null;
  }

  // Guardar el usuario actual en el almacenamiento local
  async saveCurrentUser(): Promise<void> {
    if (this._storage && this.usuarioActual) {
      await this._storage.set('currentUser', this.usuarioActual);
    }
  }

  // Agregar una dirección a un cliente
  agregarDireccion(idCliente: number, direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(`${this.apiUrl}/clientes/${idCliente}/direcciones`, {
      calle: direccion.calle,
      ciudad: direccion.ciudad,
      estado: direccion.estado,
      codigoPostal: direccion.codigoPostal,
    });
  }

  // Obtener las direcciones de un cliente
  obtenerDirecciones(idCliente: number): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.apiUrl}/clientes/${idCliente}/direcciones`);
  }

  // Editar una dirección de un cliente
  editarDireccion(idDireccion: number, direccion: Direccion): Observable<Direccion> {
    return this.http.put<Direccion>(`${this.apiUrl}/direcciones/${idDireccion}`, direccion);
  }

  // Eliminar una dirección de un cliente
  eliminarDireccion(idDireccion: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/direcciones/${idDireccion}`);
  }

  // Agregar un método de pago a un cliente
  agregarMetodoPago(idCliente: number, metodoPago: MetodosPago): Observable<MetodosPago> {
    return this.http.post<MetodosPago>(`${this.apiUrl}/clientes/${idCliente}/metodos-pago`, {
      tipo: metodoPago.tipo,
      numeroTarjeta: metodoPago.numeroTarjeta,
      fechaVencimiento: metodoPago.fechaVencimiento,
      cvv: metodoPago.cvv,
    });
  }

  // Obtener los métodos de pago de un cliente
  // En tu servicio
obtenerMetodosPago(idCliente: number): Observable<MetodosPago[]> {
  return this.http.get<any[]>(`${this.apiUrl}/clientes/${idCliente}/metodos-pago`).pipe(
    map(metodos => metodos.map(m => ({
      id: m.id,
      tipo: m.tipo,
      numeroTarjeta: m.numerotarjeta,  // Transformar snake_case a camelCase
      fechaVencimiento: m.fechavencimiento,
      cvv: m.cvv
    }))))
  };

  // Editar un método de pago de un cliente
  editarMetodoPago(idMetodoPago: number, metodoPago: MetodosPago): Observable<MetodosPago> {
    return this.http.put<MetodosPago>(`${this.apiUrl}/metodos-pago/${idMetodoPago}`, metodoPago);
  }

  // Eliminar un método de pago de un cliente
  eliminarMetodoPago(idMetodoPago: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/metodos-pago/${idMetodoPago}`);
  }
}