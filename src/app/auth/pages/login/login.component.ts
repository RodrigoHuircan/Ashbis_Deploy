import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/firebase/authentication';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  authenticationService: AuthenticationService = inject(AuthenticationService)

  constructor() { 
    this.authenticationService.authState.subscribe( respuesta => 
      console.log('user', respuesta)
    )
  }

  ngOnInit() {}

}
