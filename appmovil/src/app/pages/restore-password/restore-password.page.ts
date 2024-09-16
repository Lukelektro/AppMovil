import { Component } from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.page.html',
  styleUrls: ['./restore-password.page.scss'],
})
export class RestorePasswordPage {
  email: string = '';
  emailError: string = '';
  isValidEmail: boolean = false;

  constructor(private alertController: AlertController, private navController: NavController) {}

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.email) {
      this.emailError = 'El correo electrónico es requerido.';
      this.isValidEmail = false;
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Por favor, ingrese un correo electrónico válido.';
      this.isValidEmail = false;
    } else {
      this.emailError = '';
      this.isValidEmail = true;
    }
  }

  async onSubmit() {
    if (this.isValidEmail) {
      // Aquí iría la lógica para enviar el correo de restablecimiento
      console.log('Enviando correo a:', this.email);
      
      // Mostrar el modal de confirmación
      await this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Correo Enviado',
      message: 'Se ha enviado un correo con el enlace para restablecer tu contraseña.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navController.navigateForward('/login');
        }
      }]
    });

    await alert.present();
  }
}