import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  dataPublicacao: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private api = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  create(book: any): Observable<Book> {
    return this.http.post<Book>(this.api, book);
  }

  get(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.api}/${id}`);
  }

  update(id: number, book: any): Observable<Book> {
    return this.http.put<Book>(`${this.api}/${id}`, book);
  }

  list(): Observable<Book[]> {
    return this.http.get<Book[]>(this.api);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  searchGoogleBooks(title: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/search?title=${title}`);
  }
}