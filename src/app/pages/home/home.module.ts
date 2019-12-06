import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { HomePage } from './home.page';
import { TagsModule } from 'src/app/shared/components/tags/tags.module';
import { CompanyCardModule } from 'src/app/shared/components/company-card/company-card.module';
import { FooterModule } from 'src/app/shared/components/generic/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CompanyCardModule,
    FooterModule,
    IonicModule,
    TopComponentsModule,
    TagsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
