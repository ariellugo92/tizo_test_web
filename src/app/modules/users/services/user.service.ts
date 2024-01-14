import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserData } from '../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);

  urlBase = `${environment.API_URL}/users`;

  constructor() { }

  my(): Observable<Partial<UserData>> {
    const url = `${this.urlBase}/my`;
    return this.http.get<Partial<UserData>>(url);
  }

  getUsers(): Observable<Partial<UserData>[]> {
    return this.http.get<Partial<UserData>[]>(this.urlBase);
  }

  create(data: UserData): Observable<boolean> {
    return this.http.post<boolean>(this.urlBase, data);
  }

  getById(id: string): Observable<UserData> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<UserData>(url);
  }

  update(data: UserData, id: string): Observable<boolean> {
    const url = `${this.urlBase}/${id}`;
    return this.http.put<boolean>(url, data);
  }

  delete(id: string): Observable<boolean> {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<boolean>(url);
  }
}
