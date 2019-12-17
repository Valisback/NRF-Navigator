import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component ({
  selector: 'app-top-components',
  templateUrl: './top-components.component.html',
  styleUrls: ['./top-components.component.scss'],
})
export class TopComponentsComponent implements OnInit {
  @Input() showToolbar: boolean;
  @Input() fixed? = true;
  @Input() homepage? = false;

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  goBack() {
    this.navCtrl.back();
  }
}
