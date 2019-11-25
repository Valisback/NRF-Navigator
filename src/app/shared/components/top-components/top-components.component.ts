import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component ({
  selector: 'app-top-components',
  templateUrl: './top-components.component.html',
  styleUrls: ['./top-components.component.scss'],
})
export class TopComponentsComponent implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  goBack() {
    this.navCtrl.back();
  }
}
