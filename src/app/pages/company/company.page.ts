import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/models/company';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ScrollDetail } from '@ionic/core';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { Filter } from '../home/models/filter';


@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;

  FILTERS = ['category', 'stage', 'floor'];
  companyTags: Filter[] = [];


  public company: Company;
  public relatedCompanies: Company[] = [];
  public cpyImage;
  carouselHeight = '100px';
  images: string[];
  mapImage: string;
  likedCpies: { [id: string]: boolean } = {};
  notesCpies: { [id: string]: string } = {};
  whyExpanded = false;
  locationExpanded = true;
  contactExpanded = false;
  noteExpanded = false;

  showToolbar = false;


  public currentId;
  public currentName;
  public items: any = [];
  public companyLiked = false;


  constructor( private dbCpyService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,
               private domSanitizer: DomSanitizer,
               private storageService: StorageService,
               private storage: Storage,
  ) {
  }


  getImagePath() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.company.logo);
  }

  ngOnInit() {
    this.carouselHeight = window.innerHeight / 2 + 'px';
    this.storageService.loadStoredLikesAndNotes();
    this.storageService.likedCpies.subscribe((likedCpies) => {
      this.likedCpies = likedCpies;
    });
    this.storageService.notesCpies.subscribe((notesCpies) => {
      this.notesCpies = notesCpies;
    });
    this.route.queryParams.subscribe(params => {
      if (params.id !== undefined) {
        this.currentId = params.id;
        this.retrieveCompany(this.currentId);
      }
    });
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
  }

  retrieveTechnoImages( company: Company ) {
    this.images = [];
    let image;
    if (company.techno_image1 != null) {
      image = company.techno_image1;
      this.images.push(image);

      if (company.techno_image2 != null ) {
        image = company.techno_image2;

        this.images.push(image);
        if (company.techno_image3 != null ) {
          image = this.domSanitizer.bypassSecurityTrustUrl(company.techno_image3);
          this.images.push(image);
        }
      }
    }
  }

  retrieveMapImage( company: Company) {
    if (company.floor === 1) {
      this.mapImage = 'assets/maps/Floor1.png';
    } else if (company.floor === 3) {
      this.mapImage = 'assets/maps/Floor3.png';
    } else {
      this.mapImage = 'assets/maps/Floor4.png';
    }
  }

  retrieveRelatedCpies( company: Company ) {
    const stage = company.stage;
    const name = company.company;
    const category = company.category;
    this.dbCpyService.getRelatedCompanies(category, stage, name).subscribe( relatedCpies => {
      // Treatment for removing the actual company from the Related companies
      // Note: this treatment is necessary since firebase doesn't provide a mechanism of unequality in its queries
      for ( const item of relatedCpies) {
        if (item.company === this.company.company) {
          const index = relatedCpies.indexOf(item);
          relatedCpies.splice(index, 1);
        }
      }
      this.relatedCompanies = relatedCpies;
    });

  }

  onScroll(event: CustomEvent<ScrollDetail>) {
    if (event && event.detail && event.detail.scrollTop) {
    const scrollTop = event.detail.scrollTop;
    this.showToolbar = scrollTop >= 50;
    }
  }

  // Should be modified, not so beautiful
  expandItem(item) {
    if ( item === 'whyExpanded') {
      this.whyExpanded = !this.whyExpanded;
    } else if ( item === 'locationExpanded' ) {
      this.locationExpanded = !this.locationExpanded;
    } else if ( item === 'contactExpanded' ) {
      this.contactExpanded = !this.contactExpanded;
    } else if ( item === 'noteExpanded' ) {
      this.noteExpanded = !this.noteExpanded;
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



}
