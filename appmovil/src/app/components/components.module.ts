import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TabComponent } from './tab/tab.component';
import { CardComponent } from './card/card.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    TabComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule 
  ],
  exports: [
    ToolbarComponent,
    TabComponent,
    CardComponent
  ]
})
export class ComponentsModule {}