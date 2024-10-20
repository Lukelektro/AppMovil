import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; 

//acostumbrate a utilizar metodo try-catch cabezon del miembro

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);

  constructor() { }

  // Método READ genérico para colecciones de Firestore
  getItemsChanges<tipo>(path: string): Observable<tipo[]> {
    try {
      const itemCollection = collection(this.firestore, path);
      return collectionData(itemCollection) as Observable<tipo[]>;
    } catch (error) {
      console.error(`Error al obtener datos de la colección: ${path}`, error);
      throw new Error(`No se pudo obtener los datos de la colección: ${path}`);
    }
  }

  // Método CREATE para crear un documento sin ID específico
  async createDocument(data: any, enlace: string): Promise<void> {
    try {
      const document = doc(this.firestore, enlace);
      await setDoc(document, data);
      console.log(`Documento creado en Firestore en la ruta: ${enlace}`);
    } catch (error) {
      console.error(`Error al crear el documento en la ruta: ${enlace}`, error);
      throw new Error(`No se pudo crear el documento en la ruta: ${enlace}`);
    }
  }

  // Método CREATE para crear un documento con ID específico
  async createDocumentID(data: any, enlace: string, idDoc: string): Promise<void> {
    try {
      const document = doc(this.firestore, `${enlace}/${idDoc}`);
      await setDoc(document, data);
      console.log(`Documento con ID ${idDoc} creado en Firestore en la ruta: ${enlace}`);
    } catch (error) {
      console.error(`Error al crear el documento con ID ${idDoc} en la ruta: ${enlace}`, error);
      throw new Error(`No se pudo crear el documento con ID ${idDoc} en la ruta: ${enlace}`);
    }
  }

  // Método para generar un ID único aleatorio
  createIdDoc(): string {
    try {
      const id = uuidv4();
      console.log(`ID aleatorio generado: ${id}`);
      return id;
    } catch (error) {
      console.error('Error al generar un ID aleatorio', error);
      throw new Error('No se pudo generar un ID aleatorio');
    }
  }

}
