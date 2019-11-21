import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/services/area/db.Area.service';
import { Area } from 'src/app/shared/models/area';
import {  NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  public areas: Area[];
  private currentCategory;
  private selectedAreas: string[] = [];
  private storage;

  public defaultAreaBackground = "#ffffff";

  constructor( private dbService: DatabaseService,
               private route: ActivatedRoute,
               private navCtrl: NavController,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.cat !== undefined) {
        this.currentCategory = params.cat;
        this.dbService.getAreasByCategory(this.currentCategory).subscribe( areas => {
          this.areas = areas;
        });
      }
    });
  }

  openCompaniesFromArea(area: Area) {
    const areaName = area.name;
    if (!this.selectedAreas.includes(areaName)) {
      area.selected = true;
      this.selectedAreas.push(areaName);
    } else {
      area.selected = false;
      // If the element is already in the list of parameters, we remove it and deselect it
      const index = this.selectedAreas.indexOf(areaName);
      this.selectedAreas.splice(index, 1);
    }
  }

  openFeaturedCompanies( ) {
    this.navCtrl.navigateRoot('companies?cat=' + this.currentCategory + '&area=' + this.selectedAreas);
  }

  getImageUrl(image) {
    const gsReference = this.storage.refFromURL(image);
    console.log(gsReference);
    gsReference.getDownloadURL().then((downloadURL) => {
      console.log('DL URL: ', downloadURL);
      return downloadURL;
    });
  }

}
