import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyCardModule } from 'src/app/shared/components/company-card/company-card.module';
import { FooterModule } from 'src/app/shared/components/generic/footer/footer.module';
import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { FavouritesPageRoutingModule } from './favourites-routing.module';
import { FavouritesPage } from './favourites.page';




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
