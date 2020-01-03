import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TopComponentsModule } from 'src/app/shared/components/generic/header/top-components.module';
import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';




@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TopComponentsModule,
    ContactPageRoutingModule
  ],
  declarations: [ContactPage]
})
export class ContactPageModule {}
