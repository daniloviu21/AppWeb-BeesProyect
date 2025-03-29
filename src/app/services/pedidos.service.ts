import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';
import { Producto } from './productos.service';
import { environment } from 'src/environments/environment.prod';

export interface Pedido {
  id: number; // Cambiado a no opcional ya que es requerido
  total: number;
  fecha: Date | string;
  estado: string;
  idCliente: number;
  idDireccion: number;
  idMetodoPago: number;
  productos?: DetallePedido[];
  direccion?: string;
  metodoPago?: string;
  usuarioId?: string;
}

export interface DetallePedido {
  id?: number;
  idPedido: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: Producto;
  nombreproducto?: string;
  precio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private _storage: Storage | null = null;
  private apiUrl = environment.apiUrl;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  // API Methods (same as before)
  crearPedido(pedido: Omit<Pedido, 'id'> & {id?: number}): Observable<Pedido> {
    const requestBody = {
      total: pedido.total,
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      idCliente: pedido.idCliente,
      idDireccion: pedido.idDireccion,
      idMetodoPago: pedido.idMetodoPago
    };

    return this.http.post<Pedido>(`${this.apiUrl}/pedidos`, requestBody).pipe(
      tap((response: Pedido) => {
        console.log('Respuesta de creación de pedido:', response);
        if (!response.id) {
          throw new Error('El pedido creado no tiene ID asignado');
        }
      }),
      catchError((error: any) => {
        console.error('Error al crear pedido:', error);
        return throwError(error);
      })
    );
  }

agregarDetallePedido(idPedido: number, detalle: any): Observable<any> {
  const payload = {
    ...detalle,
    idPedido: idPedido
  };

  console.log('Enviando detalle:', payload);

  return this.http.post(`${this.apiUrl}/pedidos/${idPedido}/detalles`, payload).pipe(
    catchError(error => {
      console.error('Error completo:', error);
      return throwError(error);
    })
  );
}

  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos`);
  }

  obtenerPedidosPorCliente(idCliente: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/clientes/${idCliente}/pedidos`);
  }

  obtenerPedidosUsuario(idCliente: number): Observable<Pedido[]> {
    return this.obtenerPedidosPorCliente(idCliente);
  }

  obtenerPedidoPorId(id: number): Observable<Pedido> {
    return forkJoin([
      this.http.get<Pedido>(`${this.apiUrl}/pedidos/${id}`),
      this.http.get<DetallePedido[]>(`${this.apiUrl}/pedidos/${id}/detalles`)
    ]).pipe(
      map(([pedido, detalles]) => {
        return {
          ...pedido,
          productos: detalles
        };
      })
    );
  }

  obtenerDetallesPedido(idPedido: number): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(`${this.apiUrl}/pedidos/${idPedido}/detalles`);
  }

  actualizarEstadoPedido(id: number, nuevoEstado: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/pedidos/${id}`, { estado: nuevoEstado });
  }

  // Modified method to work with your array structure
  async generarPedidoParaMostrar(pedido: Pedido): Promise<Pedido> {
    // Get the current user to access addresses and payment methods
    const usuario = this.usuariosService.getUsuario();
    
    if (!usuario) {
      return {
        ...pedido,
        direccion: 'Dirección no disponible',
        metodoPago: 'Método de pago no disponible',
        productos: []
      };
    }

    // Find the address in the user's addresses array
    const direccion = usuario.direccion?.find(d => d.id === pedido.idDireccion);
    // Find the payment method in the user's payment methods array
    const metodoPago = usuario.metodospago?.find(m => m.id === pedido.idMetodoPago);

    // Get order details
    let detalles: DetallePedido[] = [];
    if (pedido.id) {
      detalles = await this.obtenerDetallesPedido(pedido.id as number).toPromise() || [];
    }

    return {
      ...pedido,
      direccion: direccion ? `${direccion.calle}, ${direccion.ciudad}, ${direccion.estado}` : 'Dirección no disponible',
      metodoPago: metodoPago ? `${metodoPago.tipo} •••• ${metodoPago.numeroTarjeta.slice(-4)}` : 'Método de pago no disponible',
      productos: detalles
    };
  }

  crearPedidoCompleto(pedidoData: {
    idCliente: number;
    idDireccion: number;
    idMetodoPago: number;
    productos: Array<{
      idProducto: number;
      cantidad: number;
      precioUnitario: number;
    }>;
  }): Observable<Pedido> {
    const total = pedidoData.productos.reduce(
      (sum, item) => sum + (item.precioUnitario * item.cantidad), 
      0
    );

    return this.crearPedido({
      total,
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      idCliente: pedidoData.idCliente,
      idDireccion: pedidoData.idDireccion,
      idMetodoPago: pedidoData.idMetodoPago
    }).pipe(
      switchMap((nuevoPedido: Pedido) => {
        if (!nuevoPedido.id) {
          return throwError(() => new Error('El pedido no tiene ID asignado'));
        }

        const detallesObservables = pedidoData.productos.map(producto => {
          const detalle: Omit<DetallePedido, 'id'> = {
            idPedido: nuevoPedido.id,
            idProducto: producto.idProducto,
            cantidad: producto.cantidad,
            precioUnitario: producto.precioUnitario,
            subtotal: producto.precioUnitario * producto.cantidad
          };
          return this.agregarDetallePedido(nuevoPedido.id, detalle);
        });

        return forkJoin(detallesObservables).pipe(
          map(() => nuevoPedido),
          catchError(error => {
            console.error('Error al crear detalles:', error);
            // Podemos continuar devolviendo el pedido aunque falle algún detalle
            return of(nuevoPedido);
          })
        );
      }),
      catchError((error: any) => {
        console.error('Error en crearPedidoCompleto:', error);
        return throwError(error);
      })
    );
  }

  crearPedidoConDetalles(pedidoData: {
    idCliente: number;
    idDireccion: number;
    idMetodoPago: number;
    productos: Array<{
      idProducto: number;
      cantidad: number;
      precioUnitario: number;
    }>;
  }): Observable<Pedido> {
    const total = pedidoData.productos.reduce(
      (sum, item) => sum + (item.precioUnitario * item.cantidad), 
      0
    );
  
    return this.http.post<Pedido>(`${this.apiUrl}/pedidos`, {
      total,
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      idCliente: pedidoData.idCliente,
      idDireccion: pedidoData.idDireccion,
      idMetodoPago: pedidoData.idMetodoPago
    }).pipe(
      switchMap((pedidoCreado) => {
        if (!pedidoCreado?.id) {
          throw new Error('El pedido no tiene ID asignado');
        }
  
        const detallesObservables = pedidoData.productos.map(producto => {
          const payload = {
            idpedido: pedidoCreado.id, // ¡Añadir esto es crucial!
            idproducto: producto.idProducto,
            cantidad: producto.cantidad,
            preciounitario: producto.precioUnitario,
            subtotal: producto.precioUnitario * producto.cantidad
          };
          console.log('Enviando detalle:', payload); // Para depuración
          
          return this.http.post(`${this.apiUrl}/pedidos/${pedidoCreado.id}/detalles`, payload);
        });
  
        return forkJoin(detallesObservables).pipe(
          map(() => pedidoCreado),
          catchError(error => {
            console.error('Error al crear detalles:', error);
            return of(pedidoCreado); // Continuar aunque falle algún detalle
          })
        );
      }),
      catchError(error => {
        console.error('Error en crearPedidoConDetalles:', error);
        return throwError(error);
      })
    );
  }
  // Rest of the methods remain the same...
  // (crearPedidoCompleto, local storage methods, etc.)
}