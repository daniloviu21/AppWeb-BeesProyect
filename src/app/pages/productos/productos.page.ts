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
  cargando: boolean = true;

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
    this.cargando = true;
    
    // Primero obtenemos la categoría por nombre
    this.categoriasService.getCategoriaPorNombre(this.categoriaSeleccionada).subscribe({
      next: (categoria) => {
        if (!categoria) {
          console.error('Categoría no encontrada');
          this.cargando = false;
          return;
        }
  
        // Luego obtenemos los productos filtrados por idcategoria
        this.categoriasService.getProductos().subscribe({
          next: (productos) => {
            this.productos = productos.filter(p => p.idcategoria === categoria.id && p.deleted_at === null);
            console.log('Productos filtrados:', this.productos);
            this.cargando = false;
          },
          error: (error) => {
            console.error('Error al cargar productos:', error);
            this.cargando = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al buscar categoría:', error);
        this.cargando = false;
      }
    });
  }

  private obtenerIdCategoria(nombreCategoria: string): number {
    const categorias = [
      { id: 1, nombre: 'Sublimación' },
      { id: 2, nombre: 'Anuncios' },
      { id: 3, nombre: 'Impresiones' },
      { id: 4, nombre: 'Tarjetas de Presentación' },
      { id: 5, nombre: 'Rotulación' },
      { id: 6, nombre: 'Playeras Personalizadas' },
      { id: 7, nombre: 'Sellos' },
      { id: 8, nombre: 'Lonas y Banners' },
      { id: 9, nombre: 'Material Corporativo' }
    ];
    const categoria = categorias.find(c => c.nombre === nombreCategoria);
    return categoria ? categoria.id : 0;
  }

  agregarAlCarrito(producto: Producto) {
    if (!producto) {
      console.error('El producto es undefined');
      return;
    }
  
    if (this.usuarioActual) {
      this.carritoService.agregarProducto(this.usuarioActual.id, producto)
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