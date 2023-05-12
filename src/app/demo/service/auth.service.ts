import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
    url = environment.URL_API;
    private currentUser: any;

    constructor(private http: HttpClient) { }

    // User registration
    register(user: FormData): Observable<any> {
        return this.http.post(this.url + 'auth/register', user);
    }

    updateProfile(user: FormData): Observable<any> {
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.http.post(this.url + 'auth/user-update', user, { headers: headers });
    }

    // Login
    signin(user: User): Observable<any> {
        return this.http.post<any>(this.url + 'auth/login', user);
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    // Access user profile
    profileUser(): Observable<any> {
        return this.http.get(this.url + 'auth/current-user');
    }

    getLoggedUser() {
        const url = this.url + 'auth/current-user';
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.http.get(url, { headers: headers });
    }

    getLoggedUserWIthAddress(id:any) {
        const url = this.url + 'auth/logged-user';
        const headers = new HttpHeaders(
            {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        return this.http.post(url, id, { headers: headers } );
    }

    getCurrentUser() {
        const url = this.url + 'auth/current-user';
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
        return this.http.get(this.url + 'auth/logout', { headers: headers });
    }
}
