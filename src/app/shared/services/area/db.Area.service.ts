import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Area } from '../../models/area';
import { Company } from '../../models/company';
import * as firebase from 'firebase/app';
import 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private areas: Observable<Area[]>;
  private areaCollection: AngularFirestoreCollection<Area>;
  storage: any;

  constructor(private afs: AngularFirestore) {
    this.storage = firebase.storage();
    this.areaCollection = this.afs.collection<Area>('Area');
    this.areas = this.areaCollection.snapshotChanges().pipe(
      map(actions => {
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
    // tslint:disable-next-line: max-line-length
    this.areaCollection = this.afs.collection<Area>('Area', ref => ref.orderBy('_index').where('category', 'array-contains', category.toLocaleLowerCase()));
    return this.areas = this.areaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };

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


  getImageUrl(areas) {
    for ( let area of areas) {
      const gsReference = this.storage.refFromURL(area.image);
      gsReference.getDownloadURL().then((downloadURL) => {
        console.log('DL URL: ', downloadURL);
        area.image = downloadURL;
      });
    }

  }

}
