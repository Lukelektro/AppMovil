import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TabComponent } from './tab/tab.component';
import { CardComponent } from './card/card.component';
import { SwiperComponent } from './swiper/swiper.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ToolbarComponent,
    TabComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SwiperComponent 
  ],
  exports: [
    ToolbarComponent,
    TabComponent,
    CardComponent,
    SwiperComponent 
  ]
})
export class ComponentsModule {}