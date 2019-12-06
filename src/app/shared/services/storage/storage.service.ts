import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Filter } from 'src/app/pages/home/models/filter';
import { Company } from '../../models/company';
import { FiltersService } from '../filters/filters.service';
import { DbCompanyService } from '../company/db-company.service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public allCompanies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  public filteredCompanies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  public filters: BehaviorSubject<Filter[]> = new BehaviorSubject<Filter[]>([]);

constructor(private storage: Storage,
            private dbCompanyService: DbCompanyService,
            private filterService: FiltersService,
   ) {
     this.loadData();
   }

public storeHomePageData(filters: Filter[], companies: Company[] , filteredcompanies: Company[]) {
  this.storage.set('filters', filters);
  this.storage.set('allCompanies', companies);
  this.storage.set('filteredCompanies', filteredcompanies);
}

public loadData(): void {
  this.storage.get('allCompanies').then( (value) => {
    if (value !== null ) {
      this.allCompanies.next(value);
    } else {
      this.dbCompanyService.getCompanies().subscribe(companies => {
        this.allCompanies.next(companies);
        this.filteredCompanies.next(companies);
      });
    }
  });

  this.storage.get('filteredCompanies').then( (value) => {
    if (value !== null ) {
      this.filteredCompanies.next(value);
    } else {
      this.filteredCompanies = this.allCompanies;
    }
  });

  this.storage.get('filters').then( (value) => {
    if (value !== null ) {
      this.filters.next(value);
    } else {
      this.filterService.getFilters().subscribe(filters => {
        this.filters.next(filters);
      });
    }
  });


}

public updateData(filters, allCompanies, filteredCompanies) {
  if (filters) {
    this.storage.set('filters', filters);
    this.filters.next(filters);
  }
  if (allCompanies) {
    this.storage.set('allCompanies', allCompanies);
    this.allCompanies.next(allCompanies);
  }
  if (filteredCompanies) {
    this.storage.set('filteredCompanies', filteredCompanies);
    this.filteredCompanies.next(filteredCompanies);
  }
}

}
