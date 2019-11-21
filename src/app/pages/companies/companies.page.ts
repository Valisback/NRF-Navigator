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
  public companies: Company[] = []; // list all companies in the current category and area(s)
  public filteredCompanies: Company[] = []; // lists companies filtered from the original company list
  private currentCategory; // current category seleted by the user (Retail or CPG)
  public currentAreas: string[] = []; // lists the area(s) previously selected by the user

  // Filter values
  public floorFilter: string[] = [];
  public stageFilter: string[] = [];


  constructor( private dbService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.cat !== undefined && params.area !== undefined) {
        this.currentCategory = params.cat;
        this.currentAreas = params.area.split(',');
        this.Categorycompanies = this.dbService.getCompaniesFromCatandArea(this.currentCategory);

        // After retrieving the list of companies belonging to this category,
        // we filter the ones that have at least an Area in common with the parameters selected by the user

        this.Categorycompanies.subscribe(obs => {
          let cpy: Company;
          for (cpy of obs) {
            if (this.currentAreas.includes(cpy.stage)) {
              this.companies.push(cpy);
              this.filteredCompanies.push(cpy); // Initializing the list of displayed companies
            }
          }
        });
      }
    });

  }

  // Event triggered when a company is clicked
  openCompanyDetails(companyId) {
    this.navCtrl.navigateRoot('company?id=' + companyId);
  }

  // Event triggered when a filter changes
  onFilterChanged() {
    this.filteredCompanies = [];
    if ( this.stageFilter.length === 0 && this.floorFilter.length === 0) {
      this.filteredCompanies = this.companies;
      return;
    } else if (this.stageFilter.length === 0 && this.floorFilter.length > 0) {
      for (const company of this.companies) {
        if ( this.floorFilter.includes(company.floor.toString()) ) {
          this.filteredCompanies.push(company);
        }
      }
  } else if (this.floorFilter.length === 0 && this.stageFilter.length > 0) {
    for (const company of this.companies) {
      if (this.stageFilter.includes(company.stage)) {
        this.filteredCompanies.push(company);
      }
    }
  } else {
    for (const company of this.companies) {
      if ( this.floorFilter.includes(company.floor.toString()) && this.stageFilter.includes(company.stage)) {
        this.filteredCompanies.push(company);
      }
    }
  }
  }
}
