import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { Categoria, CategoriasService, Producto } from 'src/app/services/productos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  categoriaSeleccionada: string = '';
  productos: Producto[] = [];
  usuarioActual: any;

  constructor(
    private route: ActivatedRoute,
    private categoriasService: CategoriasService,
    private carritoService: CarritoService,
    private usuariosService: UsuariosService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoriaSeleccionada = params.get('categoria')!;
      this.cargarProductos();
    });

    this.usuarioActual = this.usuariosService.getUsuario();
  }

  async cargarProductos() {
    const categorias: Categoria[] = await this.categoriasService.getCategorias();
    const categoria = categorias.find((c: Categoria) => c.nombre === this.categoriaSeleccionada);

    if (categoria) {
      this.productos = categoria.productos;
    }
  }

  agregarAlCarrito(producto: Producto) {
    if (!producto) {
      console.error('El producto es undefined');
      return;
    }
  
    console.log('Producto recibido en agregarAlCarrito:', producto);  // Depuración
  
    if (this.usuarioActual) {
      this.carritoService.agregarProducto(this.usuarioActual.user, producto)
        .then(() => {
          console.log('Producto agregado al carrito:', producto);
        })
        .catch(error => {
          console.error('Error al agregar producto al carrito:', error);
        });
    } else {
      console.error('Usuario no autenticado');
    }

    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Producto agregado al carrito',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }

  irAlCarrito() {
    this.router.navigate(['/carritocompras']);
  }
}