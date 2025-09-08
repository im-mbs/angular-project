import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValueChangeEvent } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class RequestHTTPService {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      //client-side or network error
      errorMessage = `Error : ${error.error.message}`;
    } else {
      //backend returned an unsuccessful respond
      errorMessage = `server returned code: ${error.status} , error message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private baseUrl = 'http://192.168.180.7:9000';
  private tokenKey = '';

  getRequest(): Observable<any> {
    return this.http.get<any>(this.baseUrl).pipe(catchError(this.handleError));
  }

  postRequest(path: string, onSubmitted: any): Observable<any> {
    const url = `${this.baseUrl}/${path}`;
    return this.http.post<any>(url, onSubmitted).pipe(catchError(this.handleError));
  }

  deleteRequest(userId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

}
