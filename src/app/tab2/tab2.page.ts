import { Component, OnInit } from '@angular/core';
import { Categoria, CategoriasService } from '../services/productos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit{

  categorias: Categoria[] = [];
  cargando: boolean = true;

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data.filter(categoria => categoria.deleted_at === null);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías', error);
        this.cargando = false;
      }
    });
  }
  trackByCategoria(index: number, categoria: Categoria): number {
    return categoria.id;
  }

}
