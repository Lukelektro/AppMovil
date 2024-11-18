import { Injectable } from '@angular/core';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { from, Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor(private storage: Storage) { }

  /**
   * Sube una imagen en base64 a Firebase Storage
   * @param imagen Base64 de la imagen
   * @param Animales Ruta donde se guardará la imagen (ej: 'usuarios/perfil')
   * @returns Observable con la URL de descarga
   */
  subirImagen(imagen: string, ruta: string): Observable<string> {
    const nombreArchivo = new Date().getTime().toString();
    const rutaCompleta = `${ruta}/${nombreArchivo}`;
    const storageRef = ref(this.storage, rutaCompleta);

    // Eliminar el prefijo de data URL si existe
    const base64Data = imagen.includes('data:image') 
      ? imagen.split(',')[1] 
      : imagen;

    return from(uploadString(storageRef, base64Data, 'base64', {
      contentType: 'image/jpeg'
    })).pipe(
      switchMap(() => from(getDownloadURL(storageRef)))
    );
  }

  /**
   * Sube múltiples imágenes a Firebase Storage
   * @param imagenes Array de strings base64
   * @param ruta Ruta base donde se guardarán las imágenes
   * @returns Observable con array de URLs de descarga
   */
  subirMultiplesImagenes(imagenes: string[], ruta: string): Observable<string[]> {
    if (imagenes.length === 0) return from([[]]);
    const uploads = imagenes.map(imagen => this.subirImagen(imagen, ruta));
    return forkJoin(uploads);
  }
}