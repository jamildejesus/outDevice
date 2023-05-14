import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class LoginPage implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  username: string = '';
  password: string = '';

  onSubmit() {
    // Aquí puedes agregar la lógica para validar el inicio de sesión
    console.log('Se inició sesión con nombre de usuario', this.username, 'y contraseña', this.password);
  }
}
