import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuMasPageRoutingModule } from './menu-mas-routing.module';

import { MenuMasPage } from './menu-mas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuMasPageRoutingModule
  ],
  declarations: [MenuMasPage]
})
export class MenuMasPageModule {}
