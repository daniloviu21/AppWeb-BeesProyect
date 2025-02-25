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
