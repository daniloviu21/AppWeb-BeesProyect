import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page {

  constructor( private navController: NavController ) { }

  navigateToLogin() {
    this.navController.navigateRoot('/login');
  }

}
