import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore)

  getCollectionChanges<tipo>(path:string){
    const itemCollection = collection(this.firestore, path);
    return collectionData(itemCollection) as Observable<tipo[]>;
  }

  //Forma 1, El enlace y el id vienen listos
  createDocument(data:any, enlace:string){
    const document = doc(this.firestore, enlace);
    return setDoc(document, data)
  }

  //Forma 2, concateno el enlace con el id del documento
  createDocumentID(data:any, enlace:string, idDoc: string){
    const document = doc(this.firestore, `${enlace}/${idDoc}`)
    return setDoc(document, data)
  }

  createIdDoc(){
    return uuidv4()
  }

  deleteDocumentID(enlace: string, idDoc: string){
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(document)
  }
}
