import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Usuario } from 'src/app/models/ususario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  passwordType: string = 'password'
  passwordIcon: string = 'eye-off'
  usuario: Usuario = new Usuario();



  constructor(private router: Router) { }

  ngOnInit() {
  }

  Login() {
    this.router.navigate(['/home']);
  }

  MostrarPassword(): void{

    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

}
