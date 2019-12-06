import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { Company } from '../../../models/company';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public searchValue: string;
  private allCompanies: Company[] = [];
  public searchedCompanies: Company[] = [];
  @ViewChild(IonContent, {static: false}) content: IonContent;

  constructor(
    private navCtrl: NavController,
    private dbService: DbCompanyService,
  ) {
   }

  ngOnInit() {
    this.dbService.getCompanies().subscribe( cpies => {
      this.allCompanies = cpies;
    });
  }

  onSearch(ev: any) {
    this.searchValue = ev.target.value;
    if (this.searchValue === undefined ) {
      return;
    }
    let valueSearched = this.searchValue.replace(/\s+/g, '');
    valueSearched = valueSearched.toLowerCase();

    this.searchedCompanies = [];

    if (valueSearched === 'all' || valueSearched === '*' ) {
      this.searchedCompanies = this.allCompanies;
      return;
    }

    for (const cpy of this.allCompanies) {
      if ( cpy.company === undefined || cpy.tag === undefined
        || cpy.stage === undefined || cpy.category === undefined ) {
        return;
      }

      if (cpy.company.toLowerCase().includes(valueSearched)
      || cpy.tag.toLowerCase().includes(valueSearched)
      || cpy.stage.toLowerCase().includes(valueSearched)
      || cpy.category.toLowerCase().includes(valueSearched)) {
        this.searchedCompanies.push(cpy);
      }
    }
  }

  closingNavSlideUp() {
    console.log('I am fired');
    this.content.scrollToTop();
  }
}
