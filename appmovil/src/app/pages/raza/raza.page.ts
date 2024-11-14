import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-raza',
  templateUrl: './raza.page.html',
  styleUrls: ['./raza.page.scss'],
})

export class RazaPage implements OnInit {
  public imagenBase64: string | undefined;

  constructor() { }

  ngOnInit() {
    // Initialize any required data
  }

  async capturarImagen() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      
      if (image.base64String) {
        this.imagenBase64 = `data:image/jpeg;base64,${image.base64String}`;
        // Here you can add logic to handle the captured image
        console.log('Imagen capturada exitosamente');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
}