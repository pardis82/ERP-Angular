import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, switchAll, switchMap, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment.development';
import { apiEndpoints } from '../config/api-endpoints';
import { storageKeys } from '../config/storage-keys';
import { routePaths } from '../config/route-paths';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  public currentUser = signal<User | null>(null);
  private _isRefreshing = false;
  private _accessTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    const storedUser = localStorage.getItem(storageKeys.userInfo);
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }

    window.addEventListener('storage', (event) => {
      if (event.key == storageKeys.accessToken && event.newValue === null) {
        console.warn('از یه تب دیگه لاگوت کرده');
        this.currentUser.set(null);
        this.router.navigate(['/', routePaths.login]);
      }
    });
  }

  init() {
    const accessToken =
      localStorage.getItem(storageKeys.accessToken) ||
      sessionStorage.getItem(storageKeys.accessToken);
    if (accessToken) {
      console.log('salam ok shod ');
      this.fetchCurrentUser();
    }
  }

  getAccessToken(): string | null {
    return (
      sessionStorage.getItem(storageKeys.accessToken) ||
      localStorage.getItem(storageKeys.accessToken)
    );
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  saveToken(token: { refreshToken: string; accessToken: string }, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem(storageKeys.refreshToken, token.refreshToken);
      localStorage.setItem(storageKeys.accessToken, token.accessToken);
      sessionStorage.removeItem(storageKeys.accessToken);
      sessionStorage.removeItem(storageKeys.refreshToken);
    } else {
      sessionStorage.setItem(storageKeys.refreshToken, token.refreshToken);
      sessionStorage.setItem(storageKeys.accessToken, token.accessToken);
      localStorage.removeItem(storageKeys.accessToken);
      localStorage.removeItem(storageKeys.refreshToken);
    }
  }
  fetchCurrentUser() {
    this.http.get<User>(`${environment.apiUrl}/${apiEndpoints.auth.me}`).subscribe({
      next: (response) => {
        this.currentUser.set(response);
        localStorage.setItem(storageKeys.userInfo, JSON.stringify(response));
      },
      // error: () => this.logout(),
    });
  }

  login(data: { username: string; password: string }, rememberMe: boolean) {
    const url = `${environment.apiUrl}/${apiEndpoints.auth.login}`;
    console.log('Final Login URL:', url);
    return this.http.post<any>(url, data).pipe(
      switchMap((response) => {
        this.saveToken(
          { refreshToken: response.refreshToken, accessToken: response.accessToken },
          rememberMe
        );
        return this.http.get<User>(`${environment.apiUrl}/${apiEndpoints.auth.me}`);
      }),
      tap((profile) => {
        this.currentUser.set(profile);
        localStorage.setItem(storageKeys.userInfo, JSON.stringify(profile));
      })
    );
  }

  signUp(data: { username: string; password: string; nationalCode: string }) {
    return this.http.post<any>(`${environment.apiUrl}/${apiEndpoints.auth.signup}`, data).pipe(
      tap(() => {
        console.log('شبیه سازی ثبت نام موفقیت آمیز بود');
      })
    );
  }
  refreshToken() {
    const localRefresh = localStorage.getItem(storageKeys.refreshToken);
    const sessionRefresh = sessionStorage.getItem(storageKeys.refreshToken);
    const currentToken = localRefresh || sessionRefresh;

    return this.http
      .post<any>(`${environment.apiUrl}/${apiEndpoints.auth.refresh}`, {
        refreshToken: currentToken,
      })
      .pipe(
        tap((response) => {
          this._accessTokenSubject.next(response.accessToken);
          if (localRefresh) {
            localStorage.setItem(storageKeys.accessToken, response.accessToken);
            if (response.refreshToken) {
              localStorage.setItem(storageKeys.refreshToken, response.refreshToken);
            }
          } else {
            sessionStorage.setItem(storageKeys.accessToken, response.accessToken);
            if (response.refreshToken) {
              sessionStorage.setItem(storageKeys.refreshToken, response.refreshToken);
            }
          }
        })
      );
  }

  logout() {
    sessionStorage.removeItem(storageKeys.refreshToken);
    localStorage.removeItem(storageKeys.refreshToken);
    sessionStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.userInfo);
    this.currentUser.set(null);
    this.router.navigate(['/', routePaths.login]);
  }

  get isRefreshing(): boolean {
    return this._isRefreshing;
  }
  set isRefreshing(value: boolean) {
    this._isRefreshing = value;
  }
  get accessTokenTokenSubject() {
    return this._accessTokenSubject;
  }
}
