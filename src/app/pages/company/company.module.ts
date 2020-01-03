import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SlideshowModule } from 'ng-simple-slideshow';
import { ExpandableComponent } from 'src/app/shared/components/expandable/expandable.component';
import { FooterModule } from 'src/app/shared/components/generic/footer/footer.module';
import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { TagsModule } from 'src/app/shared/components/tags/tags.module';
import { CompanyCardModule } from '../../shared/components/company-card/company-card.module';
import { CompanyPageRoutingModule } from './company-routing.module';
import { CompanyPage } from './company.page';
import { AccordionPanelComponent } from './components/accordion-panel/accordion-panel.component';
import { ModalPage } from './modal/modal.page';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FooterModule,
    TagsModule,
    SlideshowModule,
    IonicModule,
    TopComponentsModule,
    CompanyPageRoutingModule,
    CompanyCardModule
  ],
  declarations: [CompanyPage,
    ModalPage, ExpandableComponent, AccordionPanelComponent],
  entryComponents: [ModalPage],
})
export class CompanyPageModule {}
