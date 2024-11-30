import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

interface Prediccion {
  className: string;
  probability: number;
}

interface ResultadoClasificacion {
  tipoAnimal: string;
  razaMasConfiable: string;
  confianzaDeteccion: string;
}

interface RazaAPI {
  id: number;
  name: string;
  life_span: string;
  origin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisionAIService {
  private mobilenetModel: mobilenet.MobileNet | null = null;
  private razasPerro: string[] = [];
  private razasGato: string[] = [];

  constructor(private http: HttpClient) {
    this.loadBackend();
    this.cargarRazas();
  }

  private cargarRazas() {
    // Fetch dog breeds
    this.http.get<RazaAPI[]>('https://api.thedogapi.com/v1/breeds').pipe(
      map(razas => this.razasPerro = razas.map(raza => raza.name.toLowerCase()))
    ).subscribe();

    // Fetch cat breeds
    this.http.get<RazaAPI[]>('https://api.thecatapi.com/v1/breeds').pipe(
      map(razas => this.razasGato = razas.map(raza => raza.name.toLowerCase()))
    ).subscribe();
  }

  private async loadBackend() {
    try {
      await tf.setBackend('webgl');
      
      if (!tf.getBackend()) {
        await tf.setBackend('cpu');
      }
      
      console.log('Backend actual:', tf.getBackend());
    } catch (error) {
      console.error('Error al configurar backend:', error);
    }
  }

  private async loadModels() {
    try {
      if (!tf.getBackend()) {
        await this.loadBackend();
      }

      this.mobilenetModel = await mobilenet.load();
      console.log('Modelo MobileNet cargado exitosamente');
    } catch (error) {
      console.error('Error cargando modelos:', error);
      throw error;
    }
  }

  analizarImagen(imageInput: File | string): Observable<ResultadoClasificacion> {
    if (!this.mobilenetModel) {
      return from(this.loadModels()).pipe(
        switchMap(() => this.procesarImagen(imageInput)),
        catchError(error => {
          console.error('Error en la carga de modelos:', error);
          return of({
            tipoAnimal: 'No identificado',
            razaMasConfiable: 'N/A',
            confianzaDeteccion: '0'
          });
        })
      );
    }

    return this.procesarImagen(imageInput);
  }

  private procesarImagen(imageInput: File | string): Observable<ResultadoClasificacion> {
    return from(this.prepareImage(imageInput)).pipe(
      switchMap(imagen => this.clasificarRaza(imagen)),
      catchError(error => {
        console.error('Error en procesamiento de imagen:', error);
        return of({
          tipoAnimal: 'No identificado',
          razaMasConfiable: 'N/A',
          confianzaDeteccion: '0'
        });
      })
    );
  }

  private async prepareImage(imageInput: File | string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const imagen = new Image();
      
      if (typeof imageInput === 'string') {
        imagen.crossOrigin = 'anonymous';
        imagen.src = imageInput;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagen.src = e.target?.result as string;
        };
        reader.readAsDataURL(imageInput);
      }

      imagen.onload = () => resolve(imagen);
      imagen.onerror = reject;
    });
  }

  private async clasificarRaza(imagen: HTMLImageElement): Promise<ResultadoClasificacion> {
    try {
      // Clasificación con MobileNet
      const predicciones: Prediccion[] = await this.mobilenetModel!.classify(imagen);

      // Filtrar predicciones relevantes para perros o gatos
      const prediccionesRaza = predicciones
        .filter(pred => {
          const descLower = pred.className.toLowerCase();
          return this.esRazaValida(descLower);
        })
        .sort((a, b) => b.probability - a.probability);

      // Determinar tipo de animal
      const tipoAnimal = this.determinarTipoAnimal(predicciones);

      // Obtener la raza más confiable
      const razaMasConfiable = prediccionesRaza.length > 0 
        ? prediccionesRaza[0].className 
        : 'No identificado';

      const confianzaDeteccion = prediccionesRaza.length > 0 
        ? (prediccionesRaza[0].probability * 100).toFixed(2)
        : '0';

      return {
        tipoAnimal,
        razaMasConfiable,
        confianzaDeteccion
      };
    } catch (error) {
      console.error('Error en clasificación:', error);
      return { 
        tipoAnimal: 'No identificado', 
        razaMasConfiable: 'N/A', 
        confianzaDeteccion: '0' 
      };
    }
  }

  private esRazaValida(descripcion: string): boolean {
    return [...this.razasPerro, ...this.razasGato].some(raza => descripcion.includes(raza));
  }

  private determinarTipoAnimal(predicciones: Prediccion[]): string {
    const palabrasPerro = ['dog', 'retriever', 'shepherd', 'terrier', 'poodle'];
    const palabrasGato = ['cat', 'siamese', 'persian', 'maine coon'];

    const esPerro = predicciones.some(pred => 
      palabrasPerro.some(palabra => 
        pred.className.toLowerCase().includes(palabra)
      )
    );

    const esGato = predicciones.some(pred => 
      palabrasGato.some(palabra => 
        pred.className.toLowerCase().includes(palabra)
      )
    );

    if (esPerro) return 'Perro';
    if (esGato) return 'Gato';
    return 'No identificado';
  }
}