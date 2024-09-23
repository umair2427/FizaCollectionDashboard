import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.isLoading.asObservable();

  private selectedOrderSource = new BehaviorSubject<any | null>(null);
  selectedOrder$ = this.selectedOrderSource.asObservable();

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

  setSelectedOrder(order: any) {
    this.selectedOrderSource.next(order);
  }

  private setLoading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  addOrder(order: any): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${environment.url}order`, order)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getOrders(page: number, limit: number): Observable<any> {
    this.setLoading(true);
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(`${environment.url}orders`, { params })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getSingleOrder(id: string): Observable<any> {
    this.setLoading(true);
    return this.http.get<any>(`${environment.url}order/${id}`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }


  deleteOrder(id: number): Observable<any> {
    this.setLoading(true);
    return this.http.delete<any>(`${environment.url}order/${id}`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  deleteMultipleOrders(ids: number[]): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(`${environment.url}orders`, { ids })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  updateOrderStatus(payload: any): Observable<any> {
    this.setLoading(true);
    return this.http.patch<any>(`${environment.url}orderStatus`, payload)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }

  getNotifications(): Observable<any> {
    this.setLoading(true);
    return this.http.get<any>(`${environment.url}notifications`)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      )
  }
}
