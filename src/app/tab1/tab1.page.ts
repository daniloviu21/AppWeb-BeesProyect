import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../services/usuarios.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit{

  @Input() address: string = 'Cordoba México';
  @Input() cartCount: number = 0;

  constructor(private platform: Platform) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  openMaps() {
    const mapsUrl = `https://www.google.com/maps/dir/18.8142666,-96.7253164/18.92019,-96.96397/@18.8674233,-97.0139553,11z/data=!3m1!4b1!4m4!4m3!1m1!4e1!1m0?entry=ttu&g_ep=EgoyMDI1MDIyMy4xIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D`;
    window.open(mapsUrl, '_blank');
  }
}
