import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonContent, LoadingController, ModalController } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';
import { Company } from 'src/app/shared/models/company';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { Filter } from '../home/models/filter';
import { ModalPage } from './modal/modal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';




@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;

  FILTERS = ['category', 'stage', 'floor'];
  companyTags: Filter[] = [];
  filters: Filter[];



  public company: Company;
  public relatedCompanies: Company[] = [];
  public cpyImage: any;
  carouselHeight = '100px';
  images: string[];
  mapImage: string;
  likedCpies: { [id: string]: boolean } = {};
  notesCpies: { [id: string]: string } = {};
  whyExpanded = false;
  locationExpanded = true;
  contactExpanded = false;
  noteExpanded = false;
  newsroomExpanded = false;
  loading: any;
  showToolbar = false;


  public currentId: any;
  public currentName: any;
  public items: any = [];
  public companyLiked = false;


  constructor( private dbCpyService: DbCompanyService,
               private route: ActivatedRoute,
               private loadingController: LoadingController,
               private domSanitizer: DomSanitizer,
               private storageService: StorageService,
               public modalController: ModalController,
               private iab: InAppBrowser,
  ) {
    this.company = null;
  }


  getImagePath() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.company.logo);
  }

  async ngOnInit() {
    this.loadContent();
    this.carouselHeight = 464 + 'px';
    this.storageService.loadStoredLikesAndNotes();

}

async loadContent() {
  this.loading = await this.loadingController.create({ spinner: 'bubbles', cssClass: 'loading-spinner'});

  this.loading.present();


  this.route.queryParams.subscribe(params => {
    if (params.id !== undefined) {
      this.storageService.likedCpies.subscribe((likedCpies) => {
        this.likedCpies = likedCpies;
      });
      this.storageService.notesCpies.subscribe((notesCpies) => {
        this.notesCpies = notesCpies;
      });
      this.storageService.filters.subscribe((filt) => {
        this.filters = filt;
      });  
      this.company = null;
      this.currentId = params.id;
      this.retrieveCompany(this.currentId);

      //this.loading.dismiss();
    }
  });

}

  openLink(link: string) {
    const browser = this.iab.create(link, '_system');
    browser.show();
  }


retrieveTags() {
  this.companyTags = [];
  if (this.company) {
    for (let filt of this.FILTERS) {
      if (!this.company[filt]) {
        break;
      }
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


  retrieveCompany(id: string) {
    this.dbCpyService.getCompany(id).subscribe( company => {
      this.company = company;
      this.currentName = company.company;
      this.retrieveTechnoImages(company);
      this.retrieveTags();
      this.retrieveMapImage(company);
      this.retrieveRelatedCpies(company);
      this.dbCpyService.incrementCompanyViewCounter(id, company.view_counter);
      this.reInitiatePage();
    });
  }

  reInitiatePage() {
    this.content.scrollToTop(400);
    this.whyExpanded = false;
    this.locationExpanded = true;
    this.contactExpanded = false;
    this.noteExpanded = false;
    this.newsroomExpanded = false;
    this.showToolbar = false;
    this.loading.dismiss();
  }

  retrieveTechnoImages( company: Company ) {
    this.images = [];
    let image;
    if (company.techno_image1 !== null && company.techno_image1 !== '') {
      image = company.techno_image1;
      this.images.push(image);

      if (company.techno_image2 !== null && company.techno_image2 !== '') {
        image = company.techno_image2;

        this.images.push(image);
        if (company.techno_image3 !== null && company.techno_image3 !== '' ) {
          image = company.techno_image3;
          this.images.push(image);
        }
      }
    }
  }

  retrieveMapImage( company: Company) {
    if (company.map_image) {
      this.mapImage = company.map_image;
    } else {
      return;
    }
  }

  retrieveRelatedCpies( company: Company ) {
    const floor = company.floor;
    const tag = company.tag.split(', ');
    this.dbCpyService.getRelatedTagCompanies(tag).subscribe( relatedCpies => {
      if (relatedCpies.length <= 1) {
        this.dbCpyService.getRelatedFloorCompanies(floor).subscribe( relatedCpies => {
          this.removeExistingCpyFromQuery(relatedCpies);
          this.relatedCompanies =  relatedCpies;
        });

      } else {
        this.removeExistingCpyFromQuery(relatedCpies);
        this.relatedCompanies =  relatedCpies;
      }
    });
  }

  removeExistingCpyFromQuery(queryList) {
      // Treatment for removing the actual company from the Related companies
      // Note: this treatment is necessary since firebase doesn't provide a mechanism of unequality in its queries
    for ( const item of queryList) {
      if (item.company === this.company.company) {
        const index = queryList.indexOf(item);
        queryList.splice(index, 1);
      }
    }
  }

  onScroll(event: CustomEvent<ScrollDetail>) {
    if (event && event.detail && event.detail.currentY < 50) {
      this.showToolbar = false;
    } else if (event && event.detail && event.detail.scrollTop) {
    const scrollTop = event.detail.scrollTop;
    this.showToolbar = scrollTop >= 50;
    }
  }

  // Should be modified, not best practice
  expandItem(item) {
    if ( item === 'whyExpanded') {
      this.whyExpanded = !this.whyExpanded;
    } else if ( item === 'locationExpanded' ) {
      this.locationExpanded = !this.locationExpanded;
    } else if ( item === 'contactExpanded' ) {
      this.contactExpanded = !this.contactExpanded;
    } else if ( item === 'noteExpanded' ) {
      this.noteExpanded = !this.noteExpanded;
    } else if ( item === 'newsroomExpanded' ) {
      this.newsroomExpanded = !this.newsroomExpanded;
  }
  }

  onLikeClicked() {
    let likeCount = 0;
    this.likedCpies[this.currentName] = !this.likedCpies[this.currentName];
    this.storageService.updateLikes(this.likedCpies);
    this.dbCpyService.getCompanyLikes(this.currentId).subscribe( count => {
      likeCount = count;
      let action;
      if (this.likedCpies[this.currentName]) {
      action = 'increment';
    } else {
      action = 'decrement';
    }
      this.dbCpyService.changeCompanyLikeCounter(this.currentId, action, likeCount);
    }
    );
  }

  onTextAreaFilled() {
    this.storageService.updateNotes(this.notesCpies);
  }

  async presentModal(image: string) {
    const modal = await this.modalController.create({
      component: ModalPage,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'img-modal-css',
      componentProps: {
        image: image,
        floor: this.company.floor,
        booth: this.company.booth,
        modalController: this.modalController
      }
    });
    return await modal.present();
  }

}
