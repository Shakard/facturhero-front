import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Client } from '../api/client';

@Injectable()
export class ClientService {
    url = environment.URL_API;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }


    constructor(private http: HttpClient) { }


    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.url + 'auth/clients')
    }

    createClient(client: any): Observable<Client> {
        return this.http.post<Client>(this.url + 'auth/add-client', JSON.stringify(client), this.httpOptions)
    }

    updateClient(id:any, client:any): Observable<Client> {
        return this.http.put<Client>(this.url + 'auth/edit-client/' + id, JSON.stringify(client), this.httpOptions)
    }

    deleteClient(id:any){
        return this.http.delete<Client>(this.url + 'auth/delete-client/' +id, this.httpOptions)
      }
}
