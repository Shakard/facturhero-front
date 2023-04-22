import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// User interface
export class User {
    name!: String;
    email!: String;
    password!: String;
    password_confirmation!: String;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUser: any;

    constructor(private http: HttpClient) { }

    // User registration
    register(user: FormData): Observable<any> {
        return this.http.post('http://localhost/invoice-backend/public/api/auth/register', user);
    }

    updateProfile(user: FormData): Observable<any> {
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.http.post('http://localhost/invoice-backend/public/api/auth/user-update', user, { headers: headers });
    }

    // Login
    signin(user: User): Observable<any> {
        return this.http.post<any>('http://localhost/invoice-backend/public/api/auth/login', user);
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    // Access user profile
    profileUser(): Observable<any> {
        return this.http.get('http://localhost/invoice-backend/public/api/auth/current-user');
    }

    getLoggedUser() {
        const url = 'http://localhost/invoice-backend/public/api/auth/current-user';
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.http.get(url, { headers: headers });
    }

    getCurrentUser() {
        const url = 'http://localhost/invoice-backend/public/api/auth/current-user';
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.currentUser
            ? of(this.currentUser) // wrap cached value for consistent return value
            : this.http.get(url, { headers: headers })
                .pipe(
                    tap(data => { this.currentUser = data })
                );
    }

    logout() {
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.http.get('http://localhost/invoice-backend/public/api/auth/logout', { headers: headers });
    }
}
