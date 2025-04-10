import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  login(email: string, senha: string) {
    const body = JSON.stringify({ email, senha });
    return this.http.post('/base/login', body, { headers: this.headers });
  }
}
