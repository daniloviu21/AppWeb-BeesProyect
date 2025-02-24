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
      icon: "color-palette-outline", 
      router: "/categorias-layout"
    },
    { 
      nombre: 'Anuncios', 
      descripcion: 'Letreros luminosos y en acrílico.',
      icon: "megaphone-outline", 
      router: "/login"
    },
    { 
      nombre: 'Impresiones', 
      descripcion: 'Lonas, viniles y más.',
      icon: "print-outline", 
      router: "/login"
    },
    { 
      nombre: 'Tarjetas de Presentación', 
      descripcion: 'Diseño e impresión de tarjetas.',
      icon: "id-card-outline", 
      router: "/login"
    },
    { 
      nombre: 'Rotulación', 
      descripcion: 'Decoración de vidrios y vehículos.',
      icon: "car-outline", 
      router: "/login"
    },
    { 
      nombre: 'Playeras Personalizadas', 
      descripcion: 'Estampado en vinil textil y serigrafía.',
      icon: "shirt-outline", 
      router: "login"
    },
    { 
      nombre: 'Sellos', 
      descripcion: 'Sellos personalizados para empresas y oficinas.',
      icon: "easel-outline", 
      router: "/login"
    },
    { 
      nombre: 'Invitaciones', 
      descripcion: 'Diseño e impresión de invitaciones personalizadas.',
      icon: "document-text-outline", 
      router: "/login"
    },
    { 
      nombre: 'Lonas y Banners', 
      descripcion: 'Publicidad en gran formato.',
      icon: "images-outline", 
      router: "/login"
    },
    { 
      nombre: 'Material Corporativo', 
      descripcion: 'Folders, sobres, hojas membretadas.',
      icon: "briefcase-outline", 
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
