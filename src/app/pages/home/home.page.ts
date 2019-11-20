import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  retail = false;
  cpg = false;

  constructor(
    private menu: MenuController,
    public navCtrl: NavController
  ) {}

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openCategory( category ) {
      this.navCtrl.navigateRoot('categories?cat=' + category);
  }

}
