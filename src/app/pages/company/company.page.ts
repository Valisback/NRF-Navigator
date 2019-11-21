import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/models/company';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  public company: Company;
  public relatedCompanies: Company[] = [];
  public cpyImage;
  private currentId;

  constructor( private dbCpyService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,
               private domSanitizer: DomSanitizer

  ) { }

  getImagePath() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.company.logo);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.id !== undefined) {
        this.currentId = params.id;
        this.dbCpyService.getCompany(this.currentId).subscribe( company => {
          this.company = company;
          this.retrieveRelatedCpies(company);
        });
      }
    });

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


}
