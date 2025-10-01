import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication';
import { ToastController, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonNote, IonButtons, IonButton, IonIcon, IonSpinner
 } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons }  from 'ionicons';
import * as icons from 'ionicons/icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonNote, IonButtons, IonButton, IonIcon, IonSpinner],
})
export class LoginComponent  implements OnInit {
  //Declaro los módulos a usar
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  verPass: boolean = false;
  datosForm!: FormGroup;
  cargando = false;

  constructor() {
    addIcons({ eyeOutline : icons['eyeOutline']})
    addIcons({ eyeOffOutline : icons['eyeOffOutline']})
  }

  ngOnInit() {
    this.datosForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.authenticationService.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['tabs/home'], { replaceUrl: true });
      }
    });
  }

  async login() {
    this.datosForm.markAllAsTouched();
    if (this.datosForm.invalid) return;

    const { email, password } = this.datosForm.value;
    this.cargando = true;

    try {
      await this.authenticationService.login(email, password);
      await this.router.navigate(['/home'], { replaceUrl: true });
    } catch (err: any) {
      // Mapeo simple de errores comunes de Firebase Auth
      const msg =
        err?.code === 'auth/invalid-email' ? 'Email inválido' :
        err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password'
          ? 'Credenciales incorrectas'
          : 'No fue posible iniciar sesión';

      const t = await this.toastCtrl.create({
        message: msg,
        duration: 2200,
        position: 'middle',
        color: 'danger',
        buttons: [{ text: 'OK', role: 'cancel' }],
      });
      await t.present();
    } finally {
      this.cargando = false;
    }
  }

  irARegistro(){
    this.router.navigate(['/registro'], { replaceUrl: true });
  }
}
