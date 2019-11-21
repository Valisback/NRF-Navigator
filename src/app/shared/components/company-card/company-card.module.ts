import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CompanyCardComponent } from './company-card.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [CompanyCardComponent],
  exports: [
    CompanyCardComponent
  ],
})
export class CompanyCardModule {}
