import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyCardModule } from '../../company-card/company-card.module';
import { MenuComponent } from './menu.component';



@NgModule({
  imports: [
    CommonModule,
    CompanyCardModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MenuComponent],
  exports: [
    MenuComponent
  ],
})
export class MenuModule {}
