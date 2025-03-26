import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Producto } from './productos.service';
import { UsuariosService } from './usuarios.service';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private _storage: Storage | null = null;
  private usuarioId: number | null = null;
  private storageReady = false;

  constructor(private storage: Storage, private usuarioService: UsuariosService) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    const usuario = this.usuarioService.getUsuario();
    this.usuarioId = usuario?.id ?? null;
    this.storageReady = true;
    console.log('Storage y usuario listos');
  }

  private async waitForStorage(): Promise<void> {
    while (!this.storageReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private getCarritoKey(): string {
    return `carrito_${this.usuarioId}`;
  }

  async agregarAlCarrito(producto: Producto, cantidad: number) {
    if (!this.usuarioId) {
      console.error('No hay usuario logueado');
      return;
    }
  
    const carritoKey = this.getCarritoKey();
    let carrito: CarritoItem[] = (await this._storage?.get(carritoKey)) ?? [];
  
    const index = carrito.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push({ producto, cantidad });
    }
  
    await this._storage?.set(carritoKey, carrito);
  }

  async agregarProducto(usuarioId: number, producto: Producto, cantidad: number = 1): Promise<void> {
    await this.waitForStorage();
    
    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }
  
    const carritoKey = `carrito_${usuarioId}`;
    let carrito: CarritoItem[] = (await this._storage?.get(carritoKey)) ?? [];
  
    const index = carrito.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push({ producto, cantidad });
    }
  
    await this._storage?.set(carritoKey, carrito);
  }
  

  async obtenerCarrito(usuarioId: number): Promise<CarritoItem[]> {
    return (await this._storage?.get(`carrito_${usuarioId}`)) ?? [];
  }

  async eliminarProducto(usuarioId: string, producto: Producto) {
    let carrito: CarritoItem[] = await this._storage?.get(`carrito_${usuarioId}`) || [];
    const itemIndex = carrito.findIndex(item => item.producto.nombreproducto === producto.nombreproducto);

    if (itemIndex > -1) {
      if (carrito[itemIndex].cantidad > 1) {
        carrito[itemIndex].cantidad -= 1;
      } else {
        carrito.splice(itemIndex, 1);
      }
    }

    await this._storage?.set(`carrito_${usuarioId}`, carrito);
  }

  async limpiarCarrito(usuarioId: string): Promise<void> {
    if (!this.usuarioId) return;
    await this._storage?.remove(this.getCarritoKey());
  }
}