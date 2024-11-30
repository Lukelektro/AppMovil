import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VisionAIService } from '../../services/vision-ai-service.service';
import { LoadingController, ToastController } from '@ionic/angular';

// Updated interface to match the new service response
interface ResultadoAnalisis {
  tipoAnimal: string;
  razaMasConfiable: string;
  confianzaDeteccion: string;
}

@Component({
  selector: 'app-raza',
  templateUrl: './raza.page.html',
  styleUrls: ['./raza.page.scss'],
})
export class RazaPage implements OnInit {
  public imagenBase64: string | undefined;
  public resultadosAnalisis: ResultadoAnalisis | undefined;

  constructor(
    private visionService: VisionAIService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

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
        await this.analizarImagen(image.base64String);
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.mostrarMensaje('Error al capturar la imagen');
    }
  }

  async analizarImagen(base64: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Preparando análisis...'
    });
    await loading.present();
  
    try {
      // Verificar si la imagen tiene el prefijo correcto
      const base64Corregido = base64.startsWith('data:image') 
        ? base64 
        : `data:image/jpeg;base64,${base64}`;
  
      // Convertir base64 a File
      const file = this.base64ToFile(base64Corregido, 'imagen.jpg');
  
      // Analizar imagen con TensorFlow.js
      this.visionService.analizarImagen(file)
        .subscribe({
          next: (resultados) => {
            this.resultadosAnalisis = resultados;
            
            if (resultados.razaMasConfiable === 'No identificado') {
              this.mostrarMensaje('No se pudo identificar la raza con claridad');
            }
            
            loading.dismiss();
          },
          error: (error) => {
            console.error('Error en el análisis:', error);
            this.mostrarMensaje('Error al analizar la imagen');
            loading.dismiss();
          }
        });
  
    } catch (error) {
      console.error('Error general:', error);
      this.mostrarMensaje('Error inesperado al procesar la imagen');
      loading.dismiss();
    }
  }

  // Método auxiliar para convertir base64 a File
  private base64ToFile(base64: string, filename: string): File {
    try {
      // Eliminar prefijo de datos si existe
      const base64Clean = base64.replace(/^data:image\/\w+;base64,/, '');
      
      const byteCharacters = atob(base64Clean);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], filename, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error en base64ToFile:', error);
      throw new Error('No se pudo convertir la imagen');
    }
  }

  private async mostrarMensaje(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}