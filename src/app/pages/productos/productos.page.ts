import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  carrito: Producto[] = [];

  constructor(private route: ActivatedRoute,private categoriasService: CategoriasService,private router: Router) {}

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

  agregarAlCarrito(producto: Producto) {
    this.carrito.push(producto);
    console.log('Producto agregado al carrito:', producto);
  }
  
  irAlCarrito() {
    // Navegar a la página del carrito y pasar los productos del carrito
    this.router.navigate(['/carritocompras'], { state: { carrito: this.carrito } });
  }
}
