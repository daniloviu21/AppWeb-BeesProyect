import { Component, OnInit } from '@angular/core';
import { Usuario } from '../services/usuarios.service';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
  standalone: false
})
export class MetodosPagoPage implements OnInit {

  usuario!: Usuario | null;

  constructor() { }

  ngOnInit() {
    
  }

}
