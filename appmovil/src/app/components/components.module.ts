import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BottombarComponent } from './bottombar/bottombar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    BottombarComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    BottombarComponent,
    ToolbarComponent
  ]
})
export class ComponentsModule {}
