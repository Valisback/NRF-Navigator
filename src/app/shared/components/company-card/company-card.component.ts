import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Company } from 'src/app/shared/models/company';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Filter } from 'src/app/pages/home/models/filter';
import { DbCompanyService } from '../../services/company/db-company.service';
import { StorageService } from '../../services/storage/storage.service';


@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
})
export class CompanyCardComponent implements OnInit {
  @Input() company: Company;
  @Input() filters: Filter[];
  @Input() detailed? = false;
  @Input() tag_display? = false;
  @Output() tagClicked = new EventEmitter<Filter>();

  likedCpies: { [id: string]: boolean } = {};
  dataLoaded = false;

  companyTags: Filter[];

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private dbCpyService: DbCompanyService,
    private storageService: StorageService,

  ) {
    this.dataLoaded = false;
  }

  ngOnInit() {
    this.dataLoaded = false;
    this.storageService.loadStoredLikes();
    if (this.filters && this.company) {
      this.companyTags = [];
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
            .includes(filteredCategoryValue.toLowerCase())
        ) {
          const tag = filter;
          this.companyTags.push(tag);
        }
        }
      this.dataLoaded = true;
      }
    this.storageService.likedCpies.subscribe((likedCpies) => {
        this.likedCpies = likedCpies;
      });
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

  onLikeClicked(event: any) {
    event.cancelBubble = true;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    let likeCount = 0;
    this.likedCpies[this.company.company] = !this.likedCpies[this.company.company];
    this.storageService.updateLikes(this.likedCpies);
    this.dbCpyService.getCompanyLikes(this.company.id).subscribe( count => {
      likeCount = count;
      let action;
      if (this.likedCpies[this.company.company]) {
      action = 'increment';
    } else {
      action = 'decrement';
    }
      this.dbCpyService.changeCompanyLikeCounter(this.company.id, action, likeCount);
    }
    );
  }

}
