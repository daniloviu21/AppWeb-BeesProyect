import { Component, Input, OnInit } from '@angular/core';
import { Categoria, CategoriasService } from '../services/productos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit{

  direccion: string = 'Selecciona tu dirección';
  cantidadCarrito: number = 0;

  categorias: Categoria[] = [];
  
  constructor(private categoriasService: CategoriasService, private router: Router) {}
  
  async ngOnInit() {
    this.categorias = await this.categoriasService.getCategorias();
  }

  async obtenerDireccion() {
    this.direccion = '2118 Thornridge California';
  }

  async obtenerCantidadCarrito() {
    this.cantidadCarrito = 1;
  }

  seleccionarDireccion() {
    console.log('Seleccionar dirección');
  }

  irAlCarrito() {
    this.router.navigate(['/carritocompras']);
  }
}