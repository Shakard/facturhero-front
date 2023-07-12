import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class TokenService {

  constructor() {}

  handleData(token: any) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // Verify the token
  isValidToken() {
    const token = this.getToken();

    if (token) {
     return true;
    } else {
      return false;
    }
  }

  payload(token: any) {
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
  }

  // User state based on valid token
  isLoggedIn() {
    return this.isValidToken();
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('token');
  }
}
