import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { CategoryData } from '../interfaces/category-data.interface';

@Injectable({providedIn: 'root'})
export class CategoryService {

  private readonly http = inject(HttpClient);

  urlBase = `${environment.API_URL}/categories`;

  constructor() { }

  getCategories(): Observable<Partial<CategoryData>[]> {
    return this.http.get<Partial<CategoryData>[]>(this.urlBase);
  }

  create(data: CategoryData): Observable<boolean> {
    return this.http.post<boolean>(this.urlBase, data);
  }

  update(data: CategoryData, id: string): Observable<boolean> {
    const url = `${this.urlBase}/${id}`;
    return this.http.put<boolean>(url, data);
  }

  getById(id: string): Observable<CategoryData> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<CategoryData>(url);
  }

  delete(id: string): Observable<boolean> {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<boolean>(url);
  }

}
