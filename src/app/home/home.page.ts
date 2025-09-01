import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCard,
  IonButton, IonButtons, IonSpinner, IonInput, IonIcon
 } from '@ionic/angular/standalone';
import { MascotaI, UserI } from '../common/models/users.models';
import { FirestoreService } from '../common/services/firestore';
import { FormsModule } from '@angular/forms';
import { addIcons }  from 'ionicons';
import * as icons from 'ionicons/icons';
import { User } from '@angular/fire/auth';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
    IonCard, IonButton, IonButtons, IonSpinner, IonInput, IonIcon,
    FormsModule],
})
export class HomePage {
  users: UserI[] = [];
  newUser: UserI;
  cargando: boolean = false;
  mascotas: MascotaI[] = [];
  editingId: string | null = null;
  constructor(private firestoreService: FirestoreService) {
    this.loadUsers()
    this.loadMascotas()
    this.initUser()
    addIcons({ create : icons['create']})
    addIcons({ trash: icons['trash']})
  }

  loadUsers(){
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe(data => {
      if (data) {
        this.users = data
      }
    })
  }

  initUser(){
    this.newUser = {
      nombre: null,
      edad: null, 
      id: this.firestoreService.createIdDoc()
    }
  }

  loadMascotas(){
    this.firestoreService.getCollectionChanges<MascotaI>('Mascotas').subscribe(data => {
      if (data){
        this.mascotas = data
      }
    })
  }

  async save() {
    this.cargando = true;
    try {
      if (this.editingId) {
        await this.firestoreService.createDocumentID(
          { ...this.newUser, id: this.editingId },
          'Usuarios',
          this.editingId
        );
      } else {
        const id = this.newUser?.id || this.firestoreService.createIdDoc();
        await this.firestoreService.createDocumentID({ ...this.newUser, id }, 'Usuarios', id);
      }
      this.initUser();
      this.editingId = null;
    } finally {
      this.cargando = false;
    }
  }

  edit(user: UserI) {
    console.log('edita: ', user);
    this.newUser = { ...user };
    this.editingId = user.id;
  }

  async delete(user: UserI) {
    this.cargando = true;
    try {
      await this.firestoreService.deleteDocumentID('Usuarios', user.id);
      if (this.editingId === user.id) {
        this.initUser();
        this.editingId = null;
      }
    } finally {
      this.cargando = false;
    }
  }
}
