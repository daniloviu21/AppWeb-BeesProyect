import { Injectable } from '@angular/core';

export interface Pedido {
  id: string;
  usuarioId: string;
  fecha: Date;
  productos: Array<{ nombre: string, cantidad: number, precio: number }>;
  total: number;
  direccion: string;
  metodoPago: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  constructor() {}

  // Agregar un nuevo pedido
  agregarPedido(pedido: Pedido) {
    const pedidos = this.obtenerPedidosUsuario(pedido.usuarioId);
    pedidos.push(pedido);
    localStorage.setItem(`pedidos_${pedido.usuarioId}`, JSON.stringify(pedidos));
  }

  // Obtener todos los pedidos de un usuario
  obtenerPedidosUsuario(usuarioId: string): Pedido[] {
    const pedidosGuardados = localStorage.getItem(`pedidos_${usuarioId}`);
    return pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
  }
}
