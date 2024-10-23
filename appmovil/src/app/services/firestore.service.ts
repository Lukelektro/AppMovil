import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore, doc, getDoc, getDocs, deleteDoc, setDoc, query, where } from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

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
      if (typeof data !== 'object' || data === null) {
        throw new Error('Los datos para el documento deben ser un objeto válido.');
      }
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

  // Método para actualizar los datos del perfil en Firestore sin cambiar el ID
  async updateDocumentById(enlace: string, idDoc: string, data: any): Promise<void> {
    try {
      const documentRef = doc(this.firestore, `${enlace}/${idDoc}`);
      await setDoc(documentRef, data, { merge: true });  // Utiliza merge para actualizar solo campos específicos
      console.log(`Documento con ID ${idDoc} actualizado en Firestore en la ruta: ${enlace}`);
    } catch (error) {
      console.error(`Error al actualizar el documento con ID ${idDoc} en la ruta: ${enlace}`, error);
      throw new Error(`No se pudo actualizar el documento con ID ${idDoc} en la ruta: ${enlace}`);
    }
  }

  // Método para obtener un documento por el campo email
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

  // Método para obtener documentos por un query específico
  async getItemsByQuery(enlace: string, campo: string, operador: string, valor: any): Promise<any[]> {
    try {
      const coleccionRef = collection(this.firestore, enlace);  // Enlace a la colección
      const q = query(coleccionRef, where(campo, operador as any, valor));  // Creamos la query

      const querySnapshot = await getDocs(q);  // Ejecutamos la query
      const items: any[] = [];

      querySnapshot.forEach((doc) => {
        items.push(doc.data());  // Guardamos los resultados
      });

      return items;  // Retornamos los resultados
    } catch (error) {
      console.error(`Error al obtener elementos por query en la colección ${enlace}:`, error);
      throw new Error('Error al obtener los elementos por query.');
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

  // Nuevo método para obtener la URL de una imagen de Storage
  async getImageUrl(imagePath: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, imagePath);
      const url = await getDownloadURL(storageRef);
      console.log(`URL de imagen obtenida: ${url}`);
      return url;
    } catch (error) {
      console.error(`Error al obtener URL de la imagen: ${imagePath}`, error);
      throw new Error(`No se pudo obtener la URL de la imagen: ${imagePath}`);
    }
  }

  // Método para crear documento con imagen
  async createDocumentWithImage(data: any, enlace: string, imagePath: string): Promise<void> {
    try {
      // Generar ID único
      const id = this.createIdDoc();
      
      // Obtener URL de la imagen
      const imageUrl = await this.getImageUrl(imagePath);
      
      // Crear objeto con datos e imagen
      const documentData = {
        ...data,
        id,
        imageUrl,
        imagePath
      };
      
      // Crear documento usando el método existente
      await this.createDocumentID(documentData, enlace, id);
      
    } catch (error) {
      console.error('Error al crear documento con imagen:', error);
      throw error;
    }
  }

  // Método para actualizar documento con nueva imagen
  async updateDocumentWithImage(enlace: string, id: string, data: any, newImagePath?: string): Promise<void> {
    try {
      let updatedData = { ...data };
      
      // Si se proporciona nueva ruta de imagen, actualizar URL
      if (newImagePath) {
        const imageUrl = await this.getImageUrl(newImagePath);
        updatedData = {
          ...updatedData,
          imageUrl,
          imagePath: newImagePath
        };
      }
      
      // Actualizar documento usando el método existente
      await this.updateDocumentById(enlace, id, updatedData);
      
    } catch (error) {
      console.error('Error al actualizar documento con imagen:', error);
      throw error;
    }
  }

}
