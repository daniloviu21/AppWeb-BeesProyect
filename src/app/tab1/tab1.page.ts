import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../services/usuarios.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit{

  @Input() usuario!: Usuario;

  constructor() { }

  ngOnInit() {}

}
