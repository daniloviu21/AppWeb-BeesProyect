import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria, CategoriasService, Producto } from 'src/app/services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  categoriaSeleccionada: string = '';
  productos: Producto[] = [];

  constructor(private route: ActivatedRoute,private categoriasService: CategoriasService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoriaSeleccionada = params.get('categoria')!;
      this.cargarProductos();
    });
  }

  async cargarProductos() {
    const categorias: Categoria[] = await this.categoriasService.getCategorias();
    const categoria = categorias.find((c: Categoria) => c.nombre === this.categoriaSeleccionada);

    if (categoria) {
      this.productos = categoria.productos;
    }
  }
}
