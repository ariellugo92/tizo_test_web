import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenResponse } from '../interfaces/token-response.interface';
import { AuthData } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  urlBase = `${environment.API_URL}/auth`;

  constructor() { }

  register(data: AuthData): Observable<boolean> {
    const url = `${this.urlBase}/register`;
    return this.http.post<boolean>(url, data);
  }

  login(data: AuthData): Observable<TokenResponse> {
    const url = `${this.urlBase}/validate-login`;
    return this.http.post<TokenResponse>(url, data);
  }

}
