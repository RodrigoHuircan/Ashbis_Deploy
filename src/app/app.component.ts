import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthenticationService } from './firebase/authentication';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  firestore: Firestore = inject(Firestore);
  private authenticationService: AuthenticationService = inject(AuthenticationService)
  constructor() {
    this.registrarse()
  }

async registrarse() {
  const form = { email: 'carlos@gmail.com', password: '123456' };
  console.log('registrarse ->', form);
  try {
    const user = await this.authenticationService.createUser(form.email, form.password);
    console.log('user ->', user); // Aquí verás el UserCredential completo
  } catch (err: any) {
    if (err?.code === 'auth/email-already-in-use') {
      console.warn('El correo ya está registrado.');
    } else {
      console.error('Error al crear usuario:', err);
    }
  }
}
}
