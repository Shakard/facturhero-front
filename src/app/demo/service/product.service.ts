import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../api/product';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ProductService {
    url = environment.URL_API;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }


    constructor(private http: HttpClient) { }

    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.url + 'auth/products')
    }

    createProduct(product: any): Observable<Product> {
        return this.http.post<Product>(this.url + 'auth/add-product', JSON.stringify(product), this.httpOptions)
    }

    updateProduct(id: any, product: any): Observable<Product> {
        return this.http.put<Product>(this.url + 'auth/edit-product/' + id, JSON.stringify(product), this.httpOptions)
    }

    deleteProduct(id: any) {
        return this.http.delete<Product>(this.url + 'auth/delete-product/' + id, this.httpOptions)
    }
}
