import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  pageTitle: string = 'Ofertas';

  constructor(private toastController: ToastController) { }

  ngOnInit() {   
  }

  async saveChanges() {
    // Aquí iría la lógica para guardar los cambios del perfil
    const toast = await this.toastController.create({
      message: 'Cambios guardados exitosamente',
      duration: 2000
    });
    toast.present();
  }

}
