import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CompanyCardComponent } from './company-card.component';
import { TagsModule } from '../tags/tags.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TagsModule,
    IonicModule,
  ],
  declarations: [CompanyCardComponent],
  exports: [
    CompanyCardComponent
  ],
})
export class CompanyCardModule {}
