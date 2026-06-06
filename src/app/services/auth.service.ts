import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap, take } from 'rxjs/operators';
import { UsersService } from '../core/data-services/narra-pic-api/api/users.service';
import {
  AuthResponse,
  Credentials,
  LoginCredentials,
  User,
} from '../core/data-services/narra-pic-api/model/models';

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_expiry: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly USER_KEY = 'user';

  // BehaviorSubject for reliable state management
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Modern Angular signals derived from the observable
  public currentUser = toSignal(this.currentUser$, { initialValue: this.getUserFromStorage() });
  public isAuthenticated = computed(() => this.currentUser() !== null);
  
  constructor() {
    this.checkTokenExpiry();
  }

  private getUserFromStorage(): User | null {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return false;
    }
    const expiryTime = parseInt(expiry, 10);
    return Date.now() < expiryTime;
  }

  private checkTokenExpiry(): void {
    setInterval(() => {
      if (!this.hasValidToken() && this.getRefreshToken()) {
        this.refreshAccessToken().subscribe({
          error: () => this.logout(),
        });
      }
    }, 60000);
  }

  signUp(credentials: Credentials): Observable<AuthResponse> {
    return this.usersService.signUp(credentials).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Signup failed:', error);
        return throwError(() => error);
      }),
    );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.usersService.login(credentials).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.usersService.logout().subscribe();
      this.clearAuthData()
    } else {
      this.clearAuthData();
    }
  }

  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearAuthData();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.usersService.refreshToken({ refresh_token: refreshToken }).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.clearAuthData();
        return throwError(() => error);
      }),
    );
  }

  getCurrentUser(): Observable<User> {
    return this.usersService.getCurrentUser()
  }

  private handleAuthResponse(response: AuthResponse): void {
    console.log('handleAuthResponse called', response);

    if (response.access_token && response.refresh_token) {
      const expiryTime = Date.now() + (response.expires_in || 3600) * 1000;

      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
      sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

      if (response.user) {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        // Update BehaviorSubject - signal will automatically update via toSignal()
        this.currentUserSubject.next(response.user);
      }
    }
  }

  private clearAuthData(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    // Update BehaviorSubject - signal will automatically update via toSignal()
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpiringSoon(): boolean {
    const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return false;

    const expiryTime = parseInt(expiry, 10);
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes > expiryTime;
  }
}
