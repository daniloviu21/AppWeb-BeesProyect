import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CarritoItem, Producto } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async agregarProducto(usuarioId: string, producto: Producto) {
    if (!producto) {
      console.error('El producto es undefined');
      return;
    }
  
    let carrito: CarritoItem[] = await this._storage?.get(`carrito_${usuarioId}`) || [];
    console.log('Carrito antes de filtrar:', carrito);  // Depurar
  
    carrito = carrito.filter(item => item && item.producto && item.producto.nombre);
    console.log('Carrito después de filtrar:', carrito);  // Depurar
  
    const itemIndex = carrito.findIndex(item => item.producto.nombre === producto.nombre);
  
    if (itemIndex > -1) {
      carrito[itemIndex].cantidad += 1;
    } else {
      carrito.push({ producto, cantidad: 1 });
    }
  
    await this._storage?.set(`carrito_${usuarioId}`, carrito);
    console.log('Carrito después de agregar:', carrito);  // Depurar
  }

  async obtenerCarrito(usuarioId: string): Promise<CarritoItem[]> {
    return await this._storage?.get(`carrito_${usuarioId}`) || [];
  }

  async eliminarProducto(usuarioId: string, producto: Producto) {
    let carrito: CarritoItem[] = await this._storage?.get(`carrito_${usuarioId}`) || [];
    const itemIndex = carrito.findIndex(item => item.producto.nombre === producto.nombre);

    if (itemIndex > -1) {
      if (carrito[itemIndex].cantidad > 1) {
        carrito[itemIndex].cantidad -= 1;
      } else {
        carrito.splice(itemIndex, 1);
      }
    }

    await this._storage?.set(`carrito_${usuarioId}`, carrito);
  }

  async limpiarCarrito(usuarioId: string) {
    await this._storage?.remove(`carrito_${usuarioId}`);
  }
}