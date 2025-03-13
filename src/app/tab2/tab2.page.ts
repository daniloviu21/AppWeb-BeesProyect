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
    this.categoriasService.getCategorias().subscribe(
      (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      (error) => {
        console.error('Error al cargar categorías', error);
        this.cargando = false;
      }
    );
  }

}
