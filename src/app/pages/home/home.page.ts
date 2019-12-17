import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { Company } from 'src/app/shared/models/company';
import { Filter } from './models/filter';
import { Storage } from '@ionic/storage';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ScrollDetail } from '@ionic/core';
import * as THREE from 'src/three.min.js';
import RINGS from 'src/vanta.rings.min.js';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vector', {static: false}) background: ElementRef;


  retail = false;
  cpg = false;
  allCompanies: Company[];
  filteredCompanies: Company[];
  activeCategories: {[category: string]: boolean} = {};
  filters: Filter[];
  floorFilters: Filter[];
  topicFilters: Filter[];
  vantaEffect;
  fabButton_Active = false;


  showToolbar = false;
  fabButton = false;


  constructor(

    private menu: MenuController,
    public navCtrl: NavController,
    private storageService: StorageService,

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

  ngAfterViewInit() {
    this.vantaEffect = RINGS({
      el: this.background.nativeElement,
      backgroundColor: '#000000',
      height: '1200',
      width:'1000',
      THREE: THREE,
      color: '#ed0677'
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
    this.floorFilters = [];
    this.topicFilters = [];
    for (const filter of this.filters) {
      if (!(filter.type in this.activeCategories)) {
        this.activeCategories[filter.type] = false;
      }
      if (filter.name.toLocaleLowerCase().includes('floor')) {
        this.floorFilters.push(filter);
      } else {
        this.topicFilters.push(filter);
      }
    }
  }

  openCategory(category) {
    this.navCtrl.navigateRoot('categories?cat=' + category);
  }


  onTagChosen(filter: Filter, event ?: any) {
    if (event) {
      event.cancelBubble = true;
      if (event.stopPropagation) {
        event.stopPropagation();
      }
    }
    
    let temporaryCpies: Company[] = [];
    const type = filter.type;
    if (filter.active === 'FALSE') {
      filter.active = 'TRUE';
    } else {
      filter.active = 'FALSE';
    }

    this.filteredCompanies = [];

    temporaryCpies = this.allCompanies;

    for (const elem of Object.keys(this.activeCategories)) {
      this.activeCategories[elem] = false;
    }
    let reset = true;

    for (const cat of Object.keys(this.activeCategories)) {
      this.filteredCompanies = [];
      for (const genfilter of this.filters) {
        if (genfilter.active === 'TRUE' && genfilter.type === cat) {
          this.activeCategories[cat] = true;
          for (const cpy of temporaryCpies) {
            if (reset) {
              cpy.nbActivateTags = 0;
            }
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
              cpy.nbActivateTags ++;
              this.filteredCompanies.push(cpy);
            }
          }
          reset = false;
        } else if (reset) {
          for (const cpy of temporaryCpies) {
            cpy.nbActivateTags = 0;
          }
          reset = false;
        }

      }
      if (this.activeCategories[cat] === true) {
        temporaryCpies = this.filteredCompanies;
      }
    }
    this.filteredCompanies = temporaryCpies;

    // Sorting the returned list:
    // First by amount of tags matching the filters, then by floor and aplphabetical order
    this.filteredCompanies.sort((a, b) => {
      if (a.nbActivateTags === b.nbActivateTags) {
        if (a.floor === b.floor) {
          return  a.company > b.company ? 1 : -1;
        }
        return (a.floor > b.floor ) ? 1 : -1;
      }
      return (a.nbActivateTags > b.nbActivateTags ) ? 1 : -1;
    });
  }


  onScroll(event: CustomEvent<ScrollDetail>) {
    if (event && event.detail && event.detail.currentY < 50) {
      console.log(event.detail.currentY);
      this.showToolbar = false;
    } else if (event && event.detail && event.detail.scrollTop) {
    const scrollTop = event.detail.scrollTop;
    this.showToolbar = scrollTop >= 50;
    }

    if (event && event.detail && event.detail.scrollTop) {
      const scrollTop = event.detail.scrollTop;
      this.fabButton = scrollTop >= 700;
    }
    if (event && event.detail && event.detail.deltaY ) {
      const scrollTop = event.detail.deltaY;
      if ( scrollTop <= -10 ) {
        this.fabButton = false;
      }
    }
  }




}
