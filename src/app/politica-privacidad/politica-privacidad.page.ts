import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.page.html',
  styleUrls: ['./politica-privacidad.page.scss'],
  standalone: false
})
export class PoliticaPrivacidadPage implements OnInit {

 

  constructor(private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  volverATab4() {
    this.router.navigate(['/tabs/tab4']);
  }

}
