/* se borro completamente SwiperModule, swiper debe ser tratado como un componente solo, no como un conjunto de componentes */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CardComponent } from './card/card.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ToolbarComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    ToolbarComponent,
    CardComponent
  ]
})

export class ComponentsModule {}
