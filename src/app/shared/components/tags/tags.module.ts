import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { TagsComponent } from './tags.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [TagsComponent],
  exports: [
    TagsComponent
  ],
})
export class TagsModule {}
