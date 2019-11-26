import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/models/company';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';


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
  whyExpanded = false;
  locationExpanded = true;
  contactExpanded = false;
  noteExpanded = false;


  private currentId;
  public items: any = [];
  public companyLiked: boolean = false;


  constructor( private dbCpyService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,
               private domSanitizer: DomSanitizer,
               private cache: CacheService
  ) {
  }


  getImagePath() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.company.logo);
  }

  ngOnInit() {
    this.carouselHeight = window.innerHeight / 2 + 'px';
    this.route.queryParams.subscribe(params => {
      if (params.id !== undefined) {
        this.currentId = params.id;
        this.dbCpyService.getCompany(this.currentId).subscribe( company => {
          this.company = company;
          this.retrieveTechnoImages(company);
          this.retrieveMapImage(company);
          this.retrieveRelatedCpies(company);
          this.content.scrollToTop(400);
          this.dbCpyService.incrementCompanyViewCounter(this.currentId, company.view_counter);
        });
      }
    });
  }

  retrieveTechnoImages( company: Company ) {
    this.images = [];
    let image;
    if (company.techno_image1 != null) {
      image = company.techno_image1;
      console.log('Hey, ', image);
      this.images.push(image);
      console.log(this.images);

      if (company.techno_image2 != null ) {
        image = company.techno_image2;
        console.log('Hey, ', image);

        this.images.push(image);
        if (company.techno_image3 != null ) {
          image = this.domSanitizer.bypassSecurityTrustUrl(company.techno_image3);
          console.log('Hey, ', image);

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
    this.dbCpyService.getCompanyLikes(this.currentId).subscribe( count => {
      likeCount = count;
      let action;
      this.companyLiked = !this.companyLiked;
      if (this.companyLiked) {
      action = 'increment';
    } else {
      action = 'decrement';
    }
      this.dbCpyService.changeCompanyLikeCounter(this.currentId, action, likeCount);
    }
    );
  }

  

}
