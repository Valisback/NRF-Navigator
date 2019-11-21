import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/app/shared/models/company';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
})
export class CompanyCardComponent implements OnInit {
  @Input() company: Company;
  constructor(
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  onClickedCard() {
    this.navCtrl.navigateRoot('company?id=' + this.company.id);
  }

}
