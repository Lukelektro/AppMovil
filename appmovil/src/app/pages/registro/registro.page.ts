import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Auth } from '@angular/fire/auth';

// Definimos un tipo para los campos del formulario
type CamposFormulario = 'nombre' | 'email' | 'password' | 'telefono' | 'direccion';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {

  newUsuario: Usuario = {
    id: this.firestoreService.createIdDoc(),  // Genera un nuevo ID
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
  };

  errores: {[key in CamposFormulario]: string} = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  constructor(
    private navController: NavController, 
    private alertController: AlertController,
    private firestoreService: FirestoreService,
    private auth: Auth
  ) { }

  ngOnInit() {
    console.log('Firebase Auth inicializado:', this.auth);
  }

  crearUsuario(evento: CustomEvent, campo: CamposFormulario) {
    const valor = evento.detail.value?.toString() || '';
    this.newUsuario[campo] = valor;
    this.validarCampo(campo, valor);
  }

  validarCampo(campo: CamposFormulario, valor: string) {
    switch (campo) {
      case 'nombre':
        this.errores.nombre = this.validarNombre(valor);
        break;
      case 'email':
        this.errores.email = this.validarEmail(valor);
        break;
      case 'password':
        this.errores.password = this.validarPassword(valor);
        break;
      case 'telefono':
        this.errores.telefono = this.validarTelefono(valor);
        break;
      case 'direccion':
        this.errores.direccion = this.validarDireccion(valor);
        break;
    }
  }

  validarNombre(nombre: string): string {
    return nombre.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : '';
  }

  validarEmail(email: string): string {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return !regex.test(email) ? 'Email inválido' : '';
  }

  validarPassword(password: string): string {
    return password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
  }

  validarTelefono(telefono: string): string {
    const regex = /^\+?[0-9]{10,14}$/;
    return !regex.test(telefono) ? 'Teléfono inválido' : '';
  }

  validarDireccion(direccion: string): string {
    return direccion.length < 5 ? 'La dirección debe tener al menos 5 caracteres' : '';
  }

  formularioValido(): boolean {
    const camposLlenos = Object.values(this.newUsuario).every(valor => valor !== '' && valor !== null); // Asegúrate de que no haya valores nulos
    const sinErrores = Object.values(this.errores).every(error => error === '');
    return camposLlenos && sinErrores;
  }

  async guardarCambios() {
    console.log(this.newUsuario); // para verificar los valores del usuario

    if (this.formularioValido()) {
      try {
        // Guardar en Firestore
        await this.firestoreService.createDocumentID(this.newUsuario, 'Usuarios', this.newUsuario.id);

        await this.presentAlert();
        console.log('Usuario creado exitosamente');
        
      } catch (error: any) {
        console.error('Error al crear usuario:', error);
      }
    } else {
      console.log('El formulario contiene errores');
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Perfil Creado',
      message: 'Se ha creado su perfil correctamente',
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
