import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { EmailService } from '../../services/email.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.page.html',
  styleUrls: ['./verify-code.page.scss'],
})
export class VerifyCodePage implements OnInit {
  email: string = '';
  recoveryCode: string = '';
  code: string = '';
  codeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private emailService: EmailService, // Corrige el nombre de la propiedad
    private firestoreService: FirestoreService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Obtener el correo de los parámetros de navegación
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.recoveryCode = params['recoveryCode'];
      if (!this.email) {
        this.navController.navigateBack('/restore-password');
      }
    });
  }

  validateCode() {
    if (!this.code || this.code.length !== 6) {
      this.codeError = 'Ingrese un código de 6 dígitos';
      return false;
    }
    this.codeError = '';
    return true;
  }

  async onVerifyCode() {
    if (this.validateCode()) {
      try {
        const result = await this.emailService.verifyRecoveryCode(this.email, this.code);

        if (result.success) {
          // Obtener datos del documento de Firestore usando el servicio
          const usuario = await this.firestoreService.getDocumentByEmail('Usuarios', this.email);

          if (usuario) {
            // Navegar a página de registro con los datos del usuario
            this.navController.navigateForward('/registro', {
              queryParams: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                password: usuario.password,
              }
            });
          } else {
            await this.presentErrorAlert('No se encontró el usuario.');
          }
        } else {
          // Mostrar error
          await this.presentErrorAlert(result.message);
        }
      } catch (error) {
        await this.presentErrorAlert('Ocurrió un error al verificar el código');
      }
    }
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  goBack() {
    this.navController.navigateBack('/restore-password');
  }

  async resendCode() {
    try {
      const result = await this.emailService.sendPasswordRecoveryEmail(this.email);

      if (result.success) {
        const alert = await this.alertController.create({
          header: 'Código Reenviado',
          message: 'Se ha enviado un nuevo código de verificación a tu correo.',
          buttons: ['OK']
        });
        await alert.present();
      } else {
        await this.presentErrorAlert(result.message);
      }
    } catch (error) {
      await this.presentErrorAlert('Ocurrió un error al reenviar el código');
    }
  }
}