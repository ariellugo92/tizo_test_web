import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductData } from '../interfaces/product-data.interface';

@Injectable({providedIn: 'root'})
export class ProductService {

  private readonly http = inject(HttpClient);

  urlBase = `${environment.API_URL}/products`;

  constructor() { }

  getProducts(): Observable<Partial<ProductData>[]> {
    return this.http.get<Partial<ProductData>[]>(this.urlBase);
  }

  create(data: ProductData): Observable<boolean> {
    return this.http.post<boolean>(this.urlBase, data);
  }

  update(data: ProductData, id: string): Observable<boolean> {
    const url = `${this.urlBase}/${id}`;
    return this.http.put<boolean>(url, data);
  }

  getById(id: string): Observable<ProductData> {
    const url = `${this.urlBase}/${id}`;
    return this.http.get<ProductData>(url);
  }

  delete(id: string): Observable<boolean> {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<boolean>(url);
  }

}
