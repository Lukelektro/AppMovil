import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TabComponent } from './tab/tab.component';

@NgModule({
  declarations: [
    ToolbarComponent,
    TabComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule 
  ],
  exports: [
    ToolbarComponent,
    TabComponent
  ]
})
export class ComponentsModule {}