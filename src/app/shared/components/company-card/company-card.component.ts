import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/app/shared/models/company';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Filter } from 'src/app/pages/home/models/filter';


@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
})
export class CompanyCardComponent implements OnInit {
  @Input() company: Company;

  FILTERS = ['category', 'stage', 'floor'];

  companyTags: Filter[] = [];

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController

  ) {
  }

  ngOnInit() {
    this.retrieveTags();
  }

  retrieveTags() {
    this.companyTags = [];
    if (this.company) {
      for (const filt of this.FILTERS) {
        let filtValue = this.company[filt].toString().toLowerCase();
        if (filt === 'floor') {
          let suffix;
          filtValue = this.company[filt].toString().toLowerCase();
          switch (filtValue) {
            case '1' : {
              suffix = 'st';
              break;
            }
            case '2' : {
              suffix = 'nd';
              break;
            }
            case '3' : {
              suffix = 'rd';
              break;
            }
            default : {
              suffix = 'th';
              break;
            }
          }
          filtValue = filtValue + suffix + ' floor';
        }
        const tag = new Filter(filt, filtValue);
        this.companyTags.push(tag);
      }
    }

  }
  onClickedCard() {
    this.menuCtrl.close();
    this.navCtrl.navigateRoot('/company?id=' + this.company.id);
  }

  onTagClicked(event: any, tag: Filter) {
    event.cancelBubble = true;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (tag.active === 'TRUE') {
      tag.active = 'FALSE';
    } else {
      tag.active = 'TRUE';
    }
  }

}
