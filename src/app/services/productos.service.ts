import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  icon?: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface Producto {
  id: number;
  nombreproducto: string; // Ajusta el nombre de la propiedad
  descripcion: string;
  precio: number;
  stock: number;
  idMarca: number;
  idcategoria: number;
  deleted_at?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item.id,
          nombre: item.nombrecategoria,
          descripcion: item.descripcion,
          icon: this.getIconByCategory(item.nombrecategoria),
          created_at: item.created_at,
          updated_at: item.updated_at,
          deleted_at: item.deleted_at // Incluye el campo deleted_at
        }));
      })
    );
  }

  getCategoriaPorNombre(nombre: string): Observable<Categoria | undefined> {
    return this.getCategorias().pipe(
      map(categorias => categorias.find(c => c.nombre.toLowerCase() === nombre.toLowerCase()))
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