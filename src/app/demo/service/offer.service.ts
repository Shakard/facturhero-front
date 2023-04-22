import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { Offer } from '../api/offer';

@Injectable()
export class OfferService {
    url = environment.URL_API;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }


    constructor(private http: HttpClient) { }

    getOffers(): Observable<Offer[]> {
        return this.http.get<Offer[]>(this.url + 'offers')
    }

    createOffer(offer: any): Observable<Offer> {
        return this.http.post<Offer>(this.url + 'add-offer', JSON.stringify(offer), this.httpOptions)
    }

    updateOffer(id: any, offer: any): Observable<Offer> {
        return this.http.put<Offer>(this.url + 'edit-offer/' + id, JSON.stringify(offer), this.httpOptions)
    }

    deleteOffer(id: any) {
        return this.http.delete<Offer>(this.url + 'delete-offer/' + id, this.httpOptions)
    }
}
