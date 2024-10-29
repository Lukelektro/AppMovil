import { Component } from '@angular/core';
import { AlertController, NavController, LoadingController, ToastController} from '@ionic/angular';
import { Functions, httpsCallable } from '@angular/fire/functions';
@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.page.html',
  styleUrls: ['./restore-password.page.scss'],
})
export class RestorePasswordPage {
  email: string = '';
  emailError: string = '';
  isValidEmail: boolean = false;

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private functions: Functions,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,) {}

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

  async sendEmail(email: string) {
    if (!email) {
      this.showAlert('Error', 'Por favor ingresa un email válido');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Enviando email...',
      spinner: 'crescent'
    });
    await loading.present();

    const resetLink = 'reset-link';

    try {
      const sendEmailFunction = httpsCallable(this.functions, 'enviarEmailReset');
      const result = await sendEmailFunction({ email, resetLink});
      
      await loading.dismiss();
      
      if ((result.data as { success: boolean }).success) {
        const toast = await this.toastCtrl.create({
          message: 'Email enviado exitosamente',
          duration: 3000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      }
      
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error completo:', error);
      
      let errorMessage = 'Error al enviar el email. Por favor intenta de nuevo.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      this.showAlert('Error', errorMessage);
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  

  async onSubmit() {
    if (this.isValidEmail) {
      // Aquí iría la lógica para enviar el correo de restablecimiento
      console.log('Enviando correo a:', this.email);


      try {
        await this.sendEmail(this.email);
      } catch (error) {
        console.log('Error detallado:', error);
      }
      
      // Mostrar el modal de confirmación
      await this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Correo Enviado',
      message: 'Se ha enviado un enlace para restablecer tu contraseña al correo '+ this.email,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navController.navigateForward('/login');
        }
      }]
    });

    await alert.present();
  }

  goBack() {
    this.navController.back();
  }
}