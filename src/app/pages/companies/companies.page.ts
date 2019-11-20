import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/shared/models/area';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { NavController } from '@ionic/angular';
import { Company } from 'src/app/shared/models/company';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  public Categorycompanies: Observable<Company[]>;
  public companies: Company[] = [];
  private currentCategory;
  private currentAreas: string[];

  constructor( private dbService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.cat !== undefined && params.area !== undefined) {
        this.currentCategory = params.cat;
        this.currentAreas = params.area;
        console.log(this.currentAreas);
        this.Categorycompanies = this.dbService.getCompaniesFromCatandArea(this.currentCategory);

        // After retrieving the list of companies belonging to this category, we filter the ones that have at least an Area in common with the parameters selected by the user

        this.Categorycompanies.subscribe(obs => {
          let cpy: Company;
          for (cpy of obs) {
            if (cpy.areas.some(r => this.currentAreas.includes(r))) {
              console.log(cpy);
              this.companies.push(cpy);
            }
          }
        });
      }
    });

  }

  openCompanyDetails(company_id) {
    this.navCtrl.navigateRoot('company?id=' + company_id);
  }


}
