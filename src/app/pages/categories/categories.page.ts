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

  public areas: Observable<Area[]>;
  public area: Observable<Area>;
  private currentCategory;
  private selectedAreas: string[] = [];

  constructor( private dbService: DatabaseService,
               private route: ActivatedRoute,
               private navCtrl: NavController,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.cat !== undefined) {
        this.currentCategory = params.cat;
        this.areas = this.dbService.getAreasByCategory(this.currentCategory);
        console.log('areas: ', this.areas);

      }
    });
  }

  openCompaniesFromArea(areaName) {
    if (!this.selectedAreas.includes(areaName)) {
      this.selectedAreas.push(areaName);
    } else {
      // If the element is already in the list of parameters, we remove it and deselect it
      const index = this.selectedAreas.indexOf(areaName);
      this.selectedAreas.splice(index, 1);
    }
  }

  openFeaturedCompanies( ) {
    this.navCtrl.navigateRoot('companies?cat=' + this.currentCategory + '&area=' + this.selectedAreas);
  }

}
