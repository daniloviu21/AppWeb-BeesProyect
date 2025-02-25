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

  constructor(private categoriasService: CategoriasService) {}

  async ngOnInit() {
    this.categorias = await this.categoriasService.getCategorias();
  }

}
