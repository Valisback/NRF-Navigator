import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';


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
    public navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {}

  goBack() {
    const currentPage = this.router.url;
    if (currentPage.includes('company?id')) {
      this.navCtrl.navigateForward('home');
    } else {
      this.navCtrl.back();
    }
  }
}
