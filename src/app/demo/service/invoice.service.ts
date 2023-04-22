import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../api/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  URL = 'http://localhost/invoice-backend/public/api/auth/';

  constructor(private http: HttpClient) {}

  getCertificates(id:any): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(this.URL + 'certificates', id)
 }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.URL + 'invoices')
  }

  getInvoiceSerial(): Observable<any> {
    return this.http.get(this.URL + 'secuencial');
  }

  createInvoiceXML(data:any): Observable<any> {
    return this.http.post('http://localhost/invoice-backend/public/api/auth/createxml', data);
  }

  previewInvoicePDF(data:any): Observable<any> {
    return this.http.post('http://localhost/invoice-backend/public/api/auth/invoice-preview', data);
  }

  storeCertificate(data:any): Observable<any> {
    return this.http.post('http://localhost/invoice-backend/public/api/auth/store-certificate', data);
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
    return this.http.post<any>('http://localhost/invoice-backend/public/api/auth/login', data);
  }
}
