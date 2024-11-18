import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisionAIService {
  private readonly API_URL = 'https://vision.googleapis.com/v1/images:annotate';
  
  constructor(private http: HttpClient) {}

  analizarImagen(imageUrl: string): Observable<any> {
    const requestBody = {
      requests: [{
        image: {
          source: {
            imageUri: imageUrl
          }
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 15
          },
          {
            type: 'WEB_DETECTION',
            maxResults: 10
          },
          {
            type: 'OBJECT_LOCALIZATION',
            maxResults: 5
          }
        ]
      }]
    };

    return this.http.post(
      `${this.API_URL}?key=${environment.googleCloudApiKey}`,
      requestBody
    ).pipe(
      map((response: any) => {
        const visionResponse = response.responses[0];
        const labels = visionResponse.labelAnnotations || [];
        const webDetection = visionResponse.webDetection || {};
        const objects = visionResponse.localizedObjectAnnotations || [];

        // Filtrar y procesar etiquetas relacionadas con razas
        const breedLabels = labels.filter((label: any) => {
          const desc = label.description.toLowerCase();
          return desc.includes('breed') || 
                 desc.includes('terrier') ||
                 desc.includes('shepherd') ||
                 desc.includes('retriever') ||
                 desc.includes('bulldog') ||
                 desc.includes('poodle') ||
                 desc.includes('husky') ||
                 // Agregar más razas comunes aquí
                 desc.includes('spaniel');
        });

        // Procesar detección web para encontrar coincidencias de razas
        const webEntities = webDetection.webEntities || [];
        const breedEntities = webEntities.filter((entity: any) => {
          // Verificar que entity y description existen antes de usar toLowerCase()
          if (!entity || !entity.description) {
            return false;
          }
          const desc = entity.description.toLowerCase();
          return desc.includes('breed') || 
                desc.includes('dog') || 
                desc.includes('cat');
        });

        // Combinar y ordenar resultados por confianza
        const allBreedResults = [
          ...breedLabels.map((label: any) => ({
            tipo: 'Raza detectada',
            nombre: label.description,
            confianza: (label.score * 100).toFixed(2)
          })),
          ...breedEntities.map((entity: any) => ({
            tipo: 'Coincidencia web',
            nombre: entity.description,
            confianza: (entity.score * 100).toFixed(2)
          }))
        ].sort((a, b) => parseFloat(b.confianza) - parseFloat(a.confianza));

        // Determinar el tipo de animal
        const isDog = objects.some((obj: any) => 
          obj.name.toLowerCase() === 'dog'
        );
        const isCat = objects.some((obj: any) => 
          obj.name.toLowerCase() === 'cat'
        );

        return {
          tipoAnimal: isDog ? 'Perro' : (isCat ? 'Gato' : 'No identificado'),
          razasPosibles: allBreedResults,
          confianzaDeteccion: objects[0]?.score ? 
            (objects[0].score * 100).toFixed(2) : '0'
        };
      })
    );
  }
}