import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';

import { CitasPageRoutingModule } from './citas-routing.module';
import { CitasPage } from './citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CitasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CitasPage]
})
export class CitasPageModule {}
