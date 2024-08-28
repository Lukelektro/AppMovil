import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from './navbar/navbar.component';
import { BottombarComponent } from './bottombar/bottombar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    BottombarComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    NavbarComponent,
    BottombarComponent
  ]
})
export class ComponentsModule {}
