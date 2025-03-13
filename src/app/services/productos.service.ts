import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Categoria {
  nombre: string;
  descripcion: string;
  icon: string;
}

export interface Producto {
  id: number;
  nombreproducto: string; // Ajusta el nombre de la propiedad
  descripcion: string;
  precio: number;
  stock: number;
  idMarca: number;
  idcategoria: number;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = 'http://82.29.197.167:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`).pipe(
      map((data) => {
        return data.map((item) => ({
          nombre: item.nombrecategoria, // Mapea 'nombrecategoria' a 'nombre'
          descripcion: item.descripcion, // Mapea 'descripcion' a 'descripcion'
          icon: this.getIconByCategory(item.nombrecategoria), // Asigna un ícono basado en la categoría
        }));
      })
    );
  }

  // Método para asignar íconos basados en la categoría
  private getIconByCategory(nombreCategoria: string): string {
    switch (nombreCategoria.toLowerCase()) {
      case 'sublimación':
        return 'color-palette-outline';
      case 'anuncios':
        return 'megaphone-outline';
      case 'impresiones':
        return 'print-outline';
      case 'tarjetas de presentación':
        return 'id-card-outline';
      case 'rotulación':
        return 'car-outline';
      case 'playeras personalizadas':
        return 'shirt-outline';
      case 'sellos':
        return 'easel-outline';
      case 'lonas y banners':
        return 'images-outline';
      case 'material corporativo':
        return 'briefcase-outline';
      default:
        return 'help-outline'; // Ícono por defecto
    }
  }
  
  getProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos?categoriaId=${categoriaId}`);
  }

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/products`);
  }
}


// import { Injectable } from '@angular/core';
// import { Storage } from '@ionic/storage-angular';

// export interface Categoria {
//   nombre: string;
//   descripcion: string;
//   icon: string;
//   productos: Producto[];
// }

// export interface Producto {
//   nombre: string;
//   descripcion: string;
//   precio: number;
// }

// export interface CarritoItem {
//   producto: Producto;
//   cantidad: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class CategoriasService {
//   private _storage: Storage | null = null;
//   private categorias: Categoria[] = [
//     { 
//       nombre: 'Sublimación', 
//       descripcion: 'Personalización de tazas, gorras, etc.',
//       icon: "color-palette-outline",
//       productos: [
//         { nombre: 'Taza Personalizada', descripcion: 'Taza de cerámica con diseño personalizado', precio: 150 },
//         { nombre: 'Gorra Sublimada', descripcion: 'Gorra con diseño personalizado', precio: 120 }
//       ],

//     },
//     { 
//       nombre: 'Anuncios', 
//       descripcion: 'Letreros luminosos y en acrílico.',
//       icon: "megaphone-outline",
//       productos: [
//         { nombre: 'Letrero LED', descripcion: 'Letrero luminoso con diseño personalizado', precio: 500 },
//         { nombre: 'Letrero Acrílico', descripcion: 'Letrero en acrílico con fondo personalizado', precio: 350 }
//       ],

//     },
//     { 
//       nombre: 'Impresiones', 
//       descripcion: 'Lonas, viniles y más.',
//       icon: "print-outline",
//       productos: [
//         { nombre: 'Lona Publicitaria', descripcion: 'Lona de gran formato para publicidad exterior', precio: 400 },
//         { nombre: 'Vinil Impreso', descripcion: 'Vinil adhesivo personalizado para decoración', precio: 250 },
//         { nombre: 'Cartel Impreso', descripcion: 'Cartel impreso en material resistente', precio: 150 }
//       ],

//     },
//     { 
//       nombre: 'Tarjetas de Presentación', 
//       descripcion: 'Diseño e impresión de tarjetas.',
//       icon: "id-card-outline",
//       productos: [
//         { nombre: 'Tarjeta Estándar', descripcion: 'Tarjeta de presentación impresa en papel de alta calidad', precio: 100 }
//       ],

//     },
//     { 
//       nombre: 'Rotulación', 
//       descripcion: 'Decoración de vidrios y vehículos.',
//       icon: "car-outline",
//       productos: [
//         { nombre: 'Rotulación de Vehículo', descripcion: 'Vinil para rotular vehículos con diseño personalizado', precio: 800 }
//       ],

//     },
//     { 
//       nombre: 'Playeras Personalizadas', 
//       descripcion: 'Estampado en vinil textil y serigrafía.',
//       icon: "shirt-outline",
//       productos: [
//         { nombre: 'Playera Estampada', descripcion: 'Playera con estampado en vinil textil', precio: 200 },
//         { nombre: 'Playera Serigrafiada', descripcion: 'Playera con serigrafía personalizada', precio: 220 }
//       ],

//     },
//     { 
//       nombre: 'Sellos', 
//       descripcion: 'Sellos personalizados para empresas y oficinas.',
//       icon: "easel-outline",
//       productos: [
//         { nombre: 'Sello de Caucho', descripcion: 'Sello de caucho con personalización', precio: 180 }
//       ],

//     },
//     { 
//       nombre: 'Invitaciones', 
//       descripcion: 'Diseño e impresión de invitaciones personalizadas.',
//       icon: "document-text-outline",
//       productos: [
//         { nombre: 'Invitación de Boda', descripcion: 'Invitación personalizada para bodas', precio: 80 },
//         { nombre: 'Invitación de Cumpleaños', descripcion: 'Invitación para fiesta de cumpleaños', precio: 50 }
//       ],

//     },
//     { 
//       nombre: 'Lonas y Banners', 
//       descripcion: 'Publicidad en gran formato.',
//       icon: "images-outline",
//       productos: [
//         { nombre: 'Banner Publicitario', descripcion: 'Banner para publicidad de eventos', precio: 450 }
//       ],

//     },
//     { 
//       nombre: 'Material Corporativo', 
//       descripcion: 'Folders, sobres, hojas membretadas.',
//       icon: "briefcase-outline",
//       productos: [
//         { nombre: 'Folder Corporativo', descripcion: 'Folder con logo y diseño corporativo', precio: 120 }
//       ],

//     }
//   ];
  
//   private categoriaActual: Categoria | null = null;

//   constructor(private storage: Storage) {
//     this.init();
//   }

//   async init() {
//     this._storage = await this.storage.create();
//     this.loadInitialData();
//   }

//   async getCategorias(): Promise<Categoria[]> {
//     return this.categorias;
//   }

//   getCategoriaActual(): Categoria | null {
//     return this.categoriaActual;
//   }

//   setCategoriaActual(categoria: Categoria) {
//     this.categoriaActual = categoria;
//   }

//   addCategoria(categoria: Categoria): void {
//     this.categorias.push(categoria);
//   }

//   async loadInitialData(): Promise<void> {
//     await this.loadCurrentCategoria();
//   }

//   async loadCurrentCategoria(): Promise<void> {
//     if (!this._storage) return;
//     const categoria = await this._storage.get('currentCategoria');
//     this.categoriaActual = categoria ? (categoria as Categoria) : null;
//   }

//   async saveCurrentCategoria(): Promise<void> {
//     if (this._storage && this.categoriaActual) {
//       await this._storage.set('currentCategoria', this.categoriaActual);
//     }
//   }
// }
