import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Categoria {
  nombre: string;
  descripcion: string;
  icon: string;
  router: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private _storage: Storage | null = null;
  private categorias: Categoria[] = [
    { 
      nombre: 'Sublimación', 
      descripcion: 'Personalización de tazas, gorras, etc.',
      icon: "accessibility-outline",
      router: "/login"
    },
    { 
      nombre: 'Anuncios', 
      descripcion: 'Letreros luminosos y en acrílico.',
      icon: "alarm-outline",
      router: "/login"
    },
    { 
      nombre: 'Impresiones', 
      descripcion: 'Lonas, viniles y más.',
      icon: "aperture-outline",
      router: "/login"
    }
  ];
  private categoriaActual: Categoria | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.loadInitialData();
  }

  async getCategorias(): Promise<Categoria[]> {
    return this.categorias;
  }

  getCategoriaActual(): Categoria | null {
    return this.categoriaActual;
  }

  setCategoriaActual(categoria: Categoria) {
    this.categoriaActual = categoria;
  }

  addCategoria(categoria: Categoria): void {
    this.categorias.push(categoria);
  }

  async loadInitialData(): Promise<void> {
    await this.loadCurrentCategoria();
  }

  async loadCurrentCategoria(): Promise<void> {
    if (!this._storage) return;
    const categoria = await this._storage.get('currentCategoria');
    this.categoriaActual = categoria ? (categoria as Categoria) : null;
  }

  async saveCurrentCategoria(): Promise<void> {
    if (this._storage && this.categoriaActual) {
      await this._storage.set('currentCategoria', this.categoriaActual);
    }
  }
}
