import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';
import { Company } from 'src/app/shared/models/company';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import * as THREE from 'src/three.min.js';
import NET from 'src/vanta.net.min.js';
import { Filter } from '../home/models/filter';


@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vector', {static: false}) background: ElementRef;
  @ViewChild(IonContent, {static: false}) content: IonContent;


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

  ionViewDidEnter() {
    this.content.scrollToTop(400);
  }

  ngAfterViewInit() {
    this.vantaEffect = NET({
      el: this.background.nativeElement,
      backgroundColor: '#000000',
      THREE: THREE,
      color: '#ed0677'
    });
  }

  ngOnDestroy() {
    this.vantaEffect.destroy();
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
