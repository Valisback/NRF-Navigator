import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FavouritesPageRoutingModule } from './favourites-routing.module';

import { FavouritesPage } from './favourites.page';
import { CompanyCardModule } from 'src/app/shared/components/company-card/company-card.module';

import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { FooterModule } from 'src/app/shared/components/generic/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CompanyCardModule,
    TopComponentsModule,
    FooterModule,
    IonicModule,
    FavouritesPageRoutingModule
  ],
  declarations: [FavouritesPage]
})
export class FavouritesPageModule {}
