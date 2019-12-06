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

  public likedCpies: BehaviorSubject<{ [id: string]: boolean }> = new BehaviorSubject<{ [id: string]: boolean }>({});
  public notesCpies: BehaviorSubject<{ [id: string]: string }> = new BehaviorSubject<{ [id: string]: string }>({});
  public allCompanies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  public favouriteCompanies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  public filteredCompanies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  public filters: BehaviorSubject<Filter[]> = new BehaviorSubject<Filter[]>([]);

  favouritesExist = false;
  interval: any;

constructor(private storage: Storage,
            private dbCompanyService: DbCompanyService,
            private filterService: FiltersService,
   ) {
     this.loadData();
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

loadStoredLikesAndNotes(): void {
  this.storage.get('liked_Cpies').then( (value) => {
    if (value !== null ) {
      this.likedCpies.next(value);
    } else {
      this.likedCpies.next({});
    }
  });

  this.storage.get('notes_Cpies').then( (value) => {
    if (value !== null ) {
      this.notesCpies.next(value);
    } else {
      this.notesCpies.next({});
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

public updateLikes(likedCpies) {
  if (likedCpies) {
    this.storage.set('liked_Cpies', likedCpies);
    this.likedCpies.next(likedCpies);
  }
}

public updateNotes(notesCpies) {
  if (notesCpies) {
    this.storage.set('notes_Cpies', notesCpies);
    this.notesCpies.next(notesCpies);
  }
}


public loadFavourites() {
  const tempCompanies: Company[] = [];
  this.storage.get('liked_Cpies').then( (likedCompanies) => {
    if (likedCompanies !== null ) {
      for ( const cpyName of Object.keys(likedCompanies)) {
        if (likedCompanies[cpyName] === true ) {
          for (const cpy of this.allCompanies.value) {
            if (cpy.company === cpyName) {
              tempCompanies.push(cpy);
            }
          }
        }
      }
      this.favouriteCompanies.next(tempCompanies);
    }
  });
}

public CheckfavouritesExist() {
  if (this.favouriteCompanies.value.length > 0) {
    this.favouritesExist = true;
  } else {
    this.favouritesExist = false;
  }
}

}
