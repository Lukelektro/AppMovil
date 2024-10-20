import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatdogApiPageRoutingModule } from './catdog-api-routing.module';

import { CatdogApiPage } from './catdog-api.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatdogApiPageRoutingModule
  ],
  declarations: [CatdogApiPage]
})
export class CatdogApiPageModule {}
