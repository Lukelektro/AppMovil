import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../../services/firebase-storage.service';
import { VisionAIService } from '../../services/vision-ai-service.service';
import { LoadingController, ToastController } from '@ionic/angular';

interface ResultadoAnalisis {
  tipoAnimal: string;
  razasPosibles: Array<{
    tipo: string;
    nombre: string;
    confianza: string;
  }>;
  confianzaDeteccion: string;
}

@Component({
  selector: 'app-raza',
  templateUrl: './raza.page.html',
  styleUrls: ['./raza.page.scss'],
})
export class RazaPage implements OnInit {
  public imagenBase64: string | undefined;
  public urlImagen: string | undefined;
  public resultadosAnalisis: ResultadoAnalisis | undefined;

  constructor(
    private storageService: StorageService,
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
        await this.subirYAnalizarImagen(image.base64String);
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.mostrarMensaje('Error al capturar la imagen');
    }
  }

  async subirYAnalizarImagen(base64: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Analizando imagen...'
    });
    await loading.present();

    try {
      this.storageService.subirImagen(base64, 'Animales')
        .subscribe({
          next: async (url: string) => {
            this.urlImagen = url;
            
            // Analizar la imagen
            this.visionService.analizarImagen(url)
              .subscribe({
                next: (resultados: ResultadoAnalisis) => {
                  this.resultadosAnalisis = resultados;
                  if (resultados.razasPosibles.length === 0) {
                    this.mostrarMensaje('No se pudo identificar la raza con claridad');
                  }
                },
                error: (error: Error) => {
                  console.error('Error en el análisis:', error);
                  this.mostrarMensaje('Error al analizar la imagen');
                },
                complete: () => {
                  loading.dismiss();
                }
              });
          },
          error: (error: Error) => {
            console.error('Error al subir la imagen:', error);
            loading.dismiss();
            this.mostrarMensaje('Error al subir la imagen');
          }
        });
    } catch (error) {
      loading.dismiss();
      console.error('Error:', error);
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