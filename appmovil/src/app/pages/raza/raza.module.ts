import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { RazaPageRoutingModule } from './raza-routing.module';
import { RazaPage } from './raza.page';
import { Camera } from '@ionic-native/camera/ngx'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RazaPageRoutingModule
  ],
  declarations: [RazaPage],
  providers: [Camera] 
})
export class RazaPageModule {}
