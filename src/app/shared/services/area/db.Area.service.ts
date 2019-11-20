import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Area } from '../../models/area';
import { Company } from '../../models/company';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private areas: Observable<Area[]>;
  private areaCollection: AngularFirestoreCollection<Area>;

  constructor(private afs: AngularFirestore) {
    this.areaCollection = this.afs.collection<Area>('Area');
    this.areas = this.areaCollection.snapshotChanges().pipe(
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

  getAreas(): Observable<Area[]> {
    return this.areas;
  }

  getAreasByCategory(category: string): Observable<Area[]> {
    this.areaCollection = this.afs.collection<Area>('Area', ref => ref.where('category', '==', category));
    return this.areas = this.areaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  getArea(id: string): Observable<Area> {
    return this.areaCollection.doc<Area>(id).valueChanges().pipe(
      take(1),
      map(area => {
        area.id = id;
        return area;
      })
    );
  }

}
