import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://jamildejesusenriquezdeceano.pythonanywhere.com/api/token/';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(this.apiUrl, { username, password });
  }
}

