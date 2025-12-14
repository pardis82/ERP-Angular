import { HttpClient , HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BaseApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string, param?: any , options?: { params?: any; context?: HttpContext }) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options);
  }
  post<T>(endpoint: string, body: any, param?: any , options?: { params?: any; context?: HttpContext }) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }
}
