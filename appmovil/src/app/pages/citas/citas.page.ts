import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {

  nombreCliente: string = '';
  fechaCita: string = '';
  horaCita: string = '';
  servicio: string = '';
  confirmacion: string | null = null;

  constructor(private alertController: AlertController) { }


  
  ngOnInit() {
    // Recuperar el objeto perfil desde el almacenamiento local
    const perfilString = localStorage.getItem('perfil');
    if (perfilString) {
      const perfil = JSON.parse(perfilString);
      this.nombreCliente = perfil.nombre;
    }
  }


  // Horas disponibles para la cita
  horasDisponibles: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  // Servicios disponibles
  servicios: string[] = ['Peluquería', 'Desparasitación'];

  submitAppointment() {
    if (this.nombreCliente && this.fechaCita && this.horaCita && this.servicio) {
      // Simular la confirmación de la cita
      this.presentAlert();
    } else {
      // Si faltan campos
      this.confirmacion = 'Por favor, completa todos los campos.';
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Cita Agendada',
      message: `Cita agendada para el ${this.fechaCita} a las ${this.horaCita} para el servicio de ${this.servicio} para el usuario ${this.nombreCliente}.`,
      buttons: [{
        text: 'OK',
      }]
    });

    await alert.present();
  }

}




