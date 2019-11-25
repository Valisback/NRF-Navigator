import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TopComponentsModule } from 'src/app/shared/components/top-components/top-components.module'

import { CompaniesPageRoutingModule } from './companies-routing.module';

import { CompaniesPage } from './companies.page';
import { CompanyCardModule } from '../../shared/components/company-card/company-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopComponentsModule,
    CompaniesPageRoutingModule,
    CompanyCardModule
  ],
  declarations: [CompaniesPage]
})
export class CompaniesPageModule {}
