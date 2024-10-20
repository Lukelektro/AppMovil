import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore, doc, getDoc, getDocs, deleteDoc, setDoc, query, where } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
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

    // Método para obtener un documento por su ID
  async getDocumentById(enlace: string, idDoc: string): Promise<any> {
    try {
      const documentRef = doc(this.firestore, `${enlace}/${idDoc}`);
      const documentSnap = await getDoc(documentRef);
      if (documentSnap.exists()) {
        return documentSnap.data();
      } else {
        throw new Error(`Documento con ID ${idDoc} no encontrado.`);
      }
    } catch (error) {
      console.error(`Error al obtener documento con ID ${idDoc} de Firestore`, error);
      throw error;
    }
  }

  // Método en FirestoreService para obtener un documento por el campo email
  async getDocumentByEmail(enlace: string, email: string): Promise<any> {
    try {
      console.log(`Buscando documento con email: ${email}`);
      const q = query(collection(this.firestore, enlace), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Suponiendo que solo hay un documento por email
        console.log(`Documento encontrado: ${doc.data()}`);
        return doc.data(); // Devuelve los datos del documento
      } else {
        console.log(`No se encontró ningún documento con el email: ${email}`);
        throw new Error(`No se encontró ningún documento con el email: ${email}`);
      }
    } catch (error) {
      console.error(`Error al obtener documento con email ${email} de Firestore`, error);
      throw error;
    }
  }

  // Método para eliminar un documento
  async deleteDocument(enlace: string, idDoc: string): Promise<void> {
    try {
      const documentRef = doc(this.firestore, `${enlace}/${idDoc}`);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error(`Error al eliminar documento con ID ${idDoc} de Firestore`, error);
      throw error;
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
