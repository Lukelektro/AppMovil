import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
/*se movio swiper a components.module.ts, ya que solamente lo utiliza home*/
import { SwiperComponent } from 'src/app/components/swiper/swiper.component';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { ComponentsModule } from '../../components/components.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    SwiperComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
