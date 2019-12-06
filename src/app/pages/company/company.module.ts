import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CompanyCardModule } from '../../shared/components/company-card/company-card.module';
import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { SlideshowModule } from 'ng-simple-slideshow';

import { CompanyPageRoutingModule } from './company-routing.module';

import { CompanyPage } from './company.page';
import { AccordionPanelComponent } from './components/accordion-panel/accordion-panel.component';

import { ExpandableComponent } from 'src/app/shared/components/expandable/expandable.component';

import { FooterModule } from 'src/app/shared/components/generic/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FooterModule,
    SlideshowModule,
    IonicModule,
    TopComponentsModule,
    CompanyPageRoutingModule,
    CompanyCardModule
  ],
  declarations: [CompanyPage, ExpandableComponent, AccordionPanelComponent]
})
export class CompanyPageModule {}
