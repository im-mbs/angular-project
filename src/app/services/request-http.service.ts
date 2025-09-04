import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValueChangeEvent } from '@angular/forms';
import { Observable , throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RequestHTTPService {
  constructor(private http: HttpClient) {}

  private handleError(error : HttpErrorResponse):Observable<never>{
    let errorMessage = 'An unknown error occurred!';
    if(error.error instanceof ErrorEvent){
      //client-side or network error
      errorMessage = `Error : ${error.error.message}`
    }else{
      //backend returned an unsuccessful respond
      errorMessage = `server returned code: ${error.status} , error message: ${error.message}`
    }
    console.error(errorMessage)
    return throwError (() => new Error (errorMessage));
  }

  url = 'https://dummyjson.com/products';

  getUser(): Observable<any> {
    return this.http.get(this.url);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(this.url, userData);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.url}/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<any>{
    return this.http.delete(`${this.url}/${userId}`);
  }
}
