import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  standalone: false
})
export class CardInfoComponent  implements OnInit {

  @Input() usuario!: Usuario;

  constructor() { }

  ngOnInit() {}

}
