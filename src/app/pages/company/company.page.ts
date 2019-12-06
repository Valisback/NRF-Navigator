import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/models/company';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ScrollDetail } from '@ionic/core';


@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  @ViewChild(IonContent, {static: false}) content: IonContent;

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
  public items: any = [];
  public companyLiked: boolean = false;


  constructor( private dbCpyService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,
               private domSanitizer: DomSanitizer,
               private storage: Storage,
  ) {
  }


  getImagePath() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.company.logo);
  }

  ngOnInit() {
    this.retrieveStoredElements();
    this.carouselHeight = window.innerHeight / 2 + 'px';
    this.route.queryParams.subscribe(params => {
      if (params.id !== undefined) {
        this.currentId = params.id;
        this.retrieveCompany(this.currentId);
      }
    });
  }

  retrieveStoredElements() {
    this.storage.get('liked_Cpies').then( (value) => {
      if (value !== null ) {
        this.likedCpies = value;
      } else {
        this.likedCpies = {};
      }
    }).catch((err) => {
    console.log(err);
    });

    this.storage.get('notes_Cpies').then( (value) => {
      if (value !== null ) {
        this.notesCpies = value;
      } else {
        this.notesCpies = {};
      }
    }).catch((err) => {
    console.log(err);
    });

  }


  retrieveCompany(id: string) {
    this.dbCpyService.getCompany(id).subscribe( company => {
      this.company = company;
      this.retrieveTechnoImages(company);
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
    this.likedCpies[this.currentId] = !this.likedCpies[this.currentId];
    this.storage.set('liked_Cpies', this.likedCpies);
    this.dbCpyService.getCompanyLikes(this.currentId).subscribe( count => {
      likeCount = count;
      let action;
      if (this.likedCpies[this.currentId]) {
      action = 'increment';
    } else {
      action = 'decrement';
    }
      this.dbCpyService.changeCompanyLikeCounter(this.currentId, action, likeCount);
    }
    );
  }

  onTextAreaFilled() {
    this.storage.set('notes_Cpies', this.notesCpies);
  }



}
