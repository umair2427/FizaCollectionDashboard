import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './Product'

interface items {
  id?: number;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //Loaders
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.isLoading.asObservable();

  private selectedProductSource = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProductSource.asObservable();
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  private setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  setSelectedProduct(product: Product) {
    this.selectedProductSource.next(product);
  }

  addProducts(payload: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${environment.url}addProduct`, payload)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getProducts(page: number, pageSize: number): Observable<{ products: Product[], totalCount: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());
    this.setLoading(true);
    return this.http.get<{ products: Product[], totalCount: number }>(`${environment.url}getAllProducts`, { params })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getProductById(id: string): Observable<{ product: Product }> {
    this.setLoading(true);
    return this.http.get<{ product: Product }>(`${environment.url}products/${id}`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  updateProduct(id: string, data: any): Observable<any> {
    this.setLoading(true);
    return this.http.patch<any>(`${environment.url}products/${id}`, data)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  deleteProduct(id: number): Observable<any> {
    this.setLoading(true);
    return this.http.delete<any>(`${environment.url}products/${id}`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  deleteMultipleProducts(productIds: any): Observable<any> {
    console.log(productIds)
    this.setLoading(true);
    return this.http.request<any>('delete', `${environment.url}products`, {
        body:  productIds ,
      })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  getCategories(): Observable<items> {
    return this.http.get<items>(`${environment.url}getCategories`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getColors(): Observable<items> {
    return this.http.get<items>(`${environment.url}getColors`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getDeliveryStatus(): Observable<items> {
    return this.http.get<items>(`${environment.url}getDeliveryStatus`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getPaymentMethod(): Observable<items> {
    return this.http.get<items>(`${environment.url}getPaymentMethod`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getStatus(): Observable<items> {
    return this.http.get<items>(`${environment.url}getStatus`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }
}
