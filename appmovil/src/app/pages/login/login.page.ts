import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  email: string = '';
  password: string = '';
  emailInvalid = false;
  passwordInvalid = false;

  constructor(private router: Router, private loadingController: LoadingController) {}

  ngOnInit() {}

  MostrarPassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  async Login() {
    this.emailInvalid = !this.validarEmail(this.email);
    this.passwordInvalid = !this.validarPassword(this.password);

    if (this.emailInvalid || this.passwordInvalid) {
      return;
    }

    const loading = await this.loadingController.create({
      duration: 3000
    });

    await loading.present();

    // Esperar a que el loading se dismissee
    await loading.onDidDismiss();

    // Lógica para ingresar
    this.router.navigate(['/tab/home']);
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //codigo regex pa validar el email
    return re.test(String(email).toLowerCase());
  }

  validarPassword(password: string): boolean {
    // al menos 6 caracteres
    return password.length >= 6;
  }

  

}