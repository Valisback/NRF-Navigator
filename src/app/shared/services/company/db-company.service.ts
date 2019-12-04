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
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  incrementCompanyViewCounter(id: string, view: number) {
    let updatedView = 1;
    if ( view !== undefined) {
      updatedView = view + 1;
    }

    this.companycollection.doc(id).update({view_counter: updatedView});
  }

  changeCompanyLikeCounter(id: string, action: string, like: number) {
    let updatedLike = 1;
    if ( like !== undefined && action === 'increment') {
      updatedLike = like + 1;
    } else if (like !== undefined && action === 'decrement') {
      updatedLike = like - 1;
    }
    this.companycollection.doc(id).update({like_counter: updatedLike});
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

  getCompanyLikes(id: string): Observable<number> {
    return this.companycollection.doc<Company>(id).valueChanges().pipe(
      take(1),
      map(company => {
        company.id = id;
        return company.like_counter;
      })
    );
  }

}
