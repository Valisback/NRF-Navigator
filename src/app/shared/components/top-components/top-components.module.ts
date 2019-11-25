import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TopComponentsComponent } from './top-components.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [TopComponentsComponent],
  exports: [
    TopComponentsComponent
  ],
})
export class TopComponentsModule {}
