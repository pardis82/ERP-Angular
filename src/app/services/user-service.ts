import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewUser , Iuser } from '../models/user.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly BASE_URL = 'https://jsonplaceholder.typicode.com/users';
  constructor(private http: HttpClient){}
  getUsers() : Observable<Iuser[]> {
   return this.http.get<Iuser[]>(this.BASE_URL) 
  }

  postUsers(postData: NewUser): Observable<Iuser> {
    return this.http.post<Iuser>(this.BASE_URL , postData)
  }
  
}
