import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() filters: Filter[];
  @Output() tagClicked = new EventEmitter<Filter>();

  companyTags: Filter[] = [];

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController

  ) {
  }

  ngOnInit() {

    if (this.filters) {
      for (const filter of this.filters) {
        const filteredCategory = filter.type;
        let filteredCategoryValue;
        if (filteredCategory === 'floor') {
          filteredCategoryValue = filter.name[0];
        } else {
          filteredCategoryValue = filter.name;
        }
        if (
          this.company[filteredCategory]
            .toString()
            .toLowerCase()
            .includes(filteredCategoryValue)
        ) {
          const tag = filter;
          this.companyTags.push(tag);
        }
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
    this.tagClicked.emit(tag);
  }

}
