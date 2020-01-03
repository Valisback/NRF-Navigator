import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CompanyCardModule } from 'src/app/shared/components/company-card/company-card.module';
import { FooterModule } from 'src/app/shared/components/generic/footer/footer.module';
import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { TagsModule } from 'src/app/shared/components/tags/tags.module';
import { HomePage } from './home.page';

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
