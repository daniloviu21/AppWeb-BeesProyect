import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CategoriasService } from '../services/productos.service';
import { Categoria } from '../services/productos.service'; 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  
  currentIndexServ: number = 0;
  servicios = [
    { image: 'assets/icon/carrusel/servicio1.jpg', title: 'Corte y Grabado Láser', description: 'Precisión y detalle en cada corte y grabado para personalizar tus anuncios.' },
    { image: 'assets/icon/carrusel/servicio2.jpg', title:'Impresión', description:'Impresión de alta calidad para todos tus materiales publicitarios.' },
    { image: 'assets/icon/carrusel/servicio3.jpg', title:'Rotulación', description:'Rotulación profesional para vehículos, vitrinas y más.' },
    { image: 'assets/icon/carrusel/servicio4.jpg', title:'Mantenimiento', description:'Servicios de mantenimiento para asegurar que tus anuncios siempre luzcan impecables.' },
  ];

  prevSlideServ() {
    this.currentIndexServ = (this.currentIndexServ - 1 + this.servicios.length) % this.servicios.length;
  }

  nextSlideServ() {
    this.currentIndexServ = (this.currentIndexServ + 1) % this.servicios.length;
  }

  @Input() address: string = 'Cordoba Veracruz';
  @Input() cartCount: number = 0;
  categories: Categoria[] = [];

  constructor(
    private platform: Platform,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoriasService.getCategorias();
  }

  openMaps() {
    const mapsUrl = `https://www.google.com/maps/dir//18.92019,-96.96397/@18.920255,-97.0051276,13z?entry=ttu&g_ep=EgoyMDI1MDIxOS4xIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D`;
    window.open(mapsUrl, '_blank');
  }
}
