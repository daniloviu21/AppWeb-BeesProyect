import { Component, OnInit } from '@angular/core';
import { Categoria, CategoriasService } from 'src/app/services/productos.service';
@Component({
  selector: 'app-card-categories',
  templateUrl: './card-categories.component.html',
  styleUrls: ['./card-categories.component.scss'],
  standalone: false
})
export class CardCategoriesComponent  implements OnInit {

  categorias: Categoria[] = [];

  constructor(private categoriasService: CategoriasService) {}

  async ngOnInit() {
    this.categoriasService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

}
