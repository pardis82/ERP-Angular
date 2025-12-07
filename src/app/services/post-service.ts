import { Injectable } from '@angular/core';
import { Ipost } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  private readonly BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

  getPostsByUserId(userId: number): Observable<Ipost[]> {
    const url = `${this.BASE_URL}?userId=${userId}`;
    return this.http.get<Ipost[]>(url);
  }
}
