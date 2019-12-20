import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { Company } from 'src/app/shared/models/company';
import { Filter } from '../home/models/filter';
import { ScrollDetail } from '@ionic/core';

import * as THREE from 'src/three.min.js';
import NET from 'src/vanta.net.min.js';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit, AfterViewInit {
  @ViewChild('vector', {static: false}) background: ElementRef;

  favouriteCompanies: Company[];
  filters: Filter[];
  showToolbar = false;

  vantaEffect;

  constructor(
   private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.storageService.loadFavourites();
    this.storageService.favouriteCompanies.subscribe((likedCpies) => {
      this.favouriteCompanies = likedCpies;
    });
    this.storageService.filters.subscribe((filt) => {
      this.filters = filt;
    });
  }

  ngAfterViewInit() {
    this.vantaEffect = NET({
      el: this.background.nativeElement,
      backgroundColor: '#000000',
      THREE: THREE,
      color: '#ed0677'
    });
  }

  onScroll(event: CustomEvent<ScrollDetail>) {
    if (event && event.detail && event.detail.currentY < 50) {
      this.showToolbar = false;
    } else if (event && event.detail && event.detail.scrollTop) {
    const scrollTop = event.detail.scrollTop;
    this.showToolbar = scrollTop >= 50;
    }
  }

}
