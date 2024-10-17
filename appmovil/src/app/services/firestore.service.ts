import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';  

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);

  constructor() { }

  //metodo READ generico para colecciones de la firestore
  getItemsChanges<tipo>(path: string) { 
    const itemCollection = collection(this.firestore, path)
    return collectionData(itemCollection) as Observable<tipo[]>;
  }

  //metodo CREATE para crear un documento
  createDocument(data: any, enlace: string) {
    const document = doc(this.firestore,enlace);
    return setDoc(document, data);
  }

   //metodo CREATE para crear un documento con id
  createDocumentID(data: any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return setDoc(document, data);
  }

  //metodo para id aleatorio

  createIdDoc() {
    return uuidv4()
  }

}
