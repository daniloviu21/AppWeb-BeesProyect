import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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