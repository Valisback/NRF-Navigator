import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/models/company';
import { DbCompanyService } from 'src/app/shared/services/company/db-company.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  public company: Observable<Company>;
  public cpy: Company;
  private currentId;

  constructor( private dbService: DbCompanyService,
               private route: ActivatedRoute,
               private navCtrl: NavController,

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.id !== undefined) {
        this.currentId = params.id;
        this.company = this.dbService.getCompany(this.currentId);
        this.company.subscribe(obs => {
          this.cpy = obs;
          console.log(obs);
        });

      }
    });

  }


}
