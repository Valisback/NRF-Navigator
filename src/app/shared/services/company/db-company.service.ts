import { Injectable } from '@angular/core';
import { Company } from '../../models/company';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbCompanyService {

  private companies: Observable<Company[]>;
  private companycollection: AngularFirestoreCollection<Company>;

  constructor(private afs: AngularFirestore) {
    this.companycollection = this.afs.collection<Company>('Companies');
    this.companies = this.companycollection.snapshotChanges().pipe(
      map(actions => {
        console.log('ici', actions);
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  getCompanies(): Observable<Company[]> {
    return this.companies;
  }

  getCompaniesFromCatandArea(category: string): Observable<Company[]> {
    this.companycollection = this.afs.collection<Company>('Companies', ref => ref.where('category', 'in', [category, 'Both']));
    return this.companies = this.companycollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  getRelatedCompanies(category: string, stage: string, company: string): Observable<Company[]> {
    // tslint:disable-next-line: max-line-length
    this.companycollection = this.afs.collection<Company>('Companies', ref => ref.where('category', 'in', [category, 'Both']).where('stage', '==', stage));
    return this.companies = this.companycollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );

  }

  getCompany(id: string): Observable<Company> {
    return this.companycollection.doc<Company>(id).valueChanges().pipe(
      take(1),
      map(company => {
        company.id = id;
        return company;
      })
    );
  }

}
