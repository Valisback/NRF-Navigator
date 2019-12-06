import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { Company } from 'src/app/shared/models/company';
import { Filter } from './models/filter';
import { FiltersService } from 'src/app/shared/services/filters/filters.service';
import { Storage } from '@ionic/storage';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ScrollDetail } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  retail = false;
  cpg = false;
  allCompanies: Company[] = [];
  filteredCompanies: Company[] = [];
  activeCategories: {[category: string]: boolean} = {};
  filterTypes: string[] = [];
  filters: Filter[] = [];

  showToolbar = false;

  constructor(
    private menu: MenuController,
    public navCtrl: NavController,
    private dbCpyService: DbCompanyService,
    private dbFilterService: FiltersService,
    private storageService: StorageService,
    private storage: Storage,

  ) {}

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    if (this.filters.length > 0 && this.allCompanies.length > 0) {
      this.storageService.updateData(this.filters, this.allCompanies, this.filteredCompanies);
    }

  }

  ngOnInit() {
    this.storageService.allCompanies.subscribe((cpies) => {
      this.allCompanies = cpies;
    });
    this.storageService.filteredCompanies.subscribe((filteredCpies) => {
      this.filteredCompanies = filteredCpies;
    });
    this.storageService.filters.subscribe((filt) => {
      this.filters = filt;
      this.initializeFilteringParams();
    });
  }

  ngOnDestroy() {
    if (this.filters.length > 0 && this.allCompanies.length > 0) {
      this.storageService.updateData(this.filters, this.allCompanies, this.filteredCompanies);
    }
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  initializeFilteringParams() {
    for (const filter of this.filters) {
      if (!this.filterTypes.includes(filter.type)) {
        this.filterTypes.push(filter.type);
        this.activeCategories[filter.type] = false;
      }
    }
  }

  openCategory(category) {
    this.navCtrl.navigateRoot('categories?cat=' + category);
  }

 
  onTagChosen(filter: Filter) {
    let temporaryCpies: Company[] = [];
    const type = filter.type;
    if (filter.active === 'FALSE') {
      filter.active = 'TRUE';
    } else {
      filter.active = 'FALSE';
    }

    this.filteredCompanies = [];

    temporaryCpies = this.allCompanies;

    for (let elem in this.activeCategories) {
      this.activeCategories[elem] = false;
    }

    for (const cat of this.filterTypes) {
      this.filteredCompanies = [];
      for (const genfilter of this.filters) {
        if (genfilter.active === 'TRUE' && genfilter.type === cat) {
          this.activeCategories[cat] = true;
          for (const cpy of temporaryCpies) {

            const filteredCategory = genfilter.type.toLowerCase();
            let filteredCategoryValue = genfilter.name.toLowerCase();
            if (filteredCategory === 'floor') {
              filteredCategoryValue = genfilter.name[0];
            }

            if (
              cpy[filteredCategory]
                .toString()
                .toLowerCase()
                .includes(filteredCategoryValue)
            ) {
              this.filteredCompanies.push(cpy);
            }
          }
        }
      }
      if (this.activeCategories[cat] === true) {
        temporaryCpies = this.filteredCompanies;
      }
    }
    this.filteredCompanies = temporaryCpies;
  }


  onScroll(event: CustomEvent<ScrollDetail>) {
    if (event && event.detail && event.detail.scrollTop) {
    const scrollTop = event.detail.scrollTop;
    this.showToolbar = scrollTop >= 50;
    }
  }




}
