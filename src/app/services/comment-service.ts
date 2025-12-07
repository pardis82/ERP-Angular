import { Injectable } from '@angular/core';
import { Icomment, NewComment } from '../models/comment.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  private readonly BASE_URL = 'https://jsonplaceholder.typicode.com/comments';
  getCommentsByPostId(postId: number): Observable<Icomment> {
    const url = `${this.BASE_URL}?postId=${postId}`;
    return this.http.get<Icomment>(url);
  }
}
