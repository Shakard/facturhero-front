import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../api/invoice';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {

    URL = environment.URL_API;
    constructor(private http: HttpClient) { }

    getCertificates(id: any): Observable<Invoice[]> {
        return this.http.post<Invoice[]>(this.URL + 'auth/certificates', id)
    }

    getInvoices(): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(this.URL + 'auth/invoices')
    }

    getInvoiceSerial(): Observable<any> {
        return this.http.get(this.URL + 'auth/secuencial');
    }

    createInvoiceXML(data: any): Observable<any> {
        return this.http.post(this.URL + 'auth/createxml', data);
    }

    previewInvoicePDF(data: any): Observable<any> {
        return this.http.post(this.URL + 'auth/invoice-preview', data);
    }

    storeCertificate(data: any): Observable<any> {
        return this.http.post(this.URL + 'auth/store-certificate', data);
    }

    // store(url: string, data: any, params = new HttpParams()) {
    //   const headers = new HttpHeaders(
    //     {
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     }
    //   );
    //   url = this.url + url;
    //   return this.httpClient.post(url, data, { params, headers: headers});
    // }

    signDocument(data: any): Observable<any> {
        return this.http.post<any>(this.URL + 'auth/login', data);
    }
}
