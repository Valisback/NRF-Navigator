import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filter } from 'src/app/pages/home/models/filter';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private filters: Observable<Filter[]>;
  private filterCollection: AngularFirestoreCollection<Filter>;
  storage: any;

  constructor(private afs: AngularFirestore) {
    this.storage = firebase.storage();
    this.filterCollection = this.afs.collection<Filter>('Filters');
    this.filters = this.filterCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  getFilters(): Observable<Filter[]> {
    return this.filters;
  }
}
