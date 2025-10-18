
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Book { id?: number; titulo: string; autor: string; isbn: string; dataPublicacao: string; categoria: string; }

@Injectable({ providedIn: 'root' })
export class BooksService {
  private api = `${environment.apiUrl}/books`;
  constructor(private http: HttpClient) { }

  list(): Observable<Book[]> { return this.http.get<Book[]>(this.api); }
  get(id: number) { return this.http.get<Book>(`${this.api}/${id}`); }
  create(book: Book) { return this.http.post<Book>(this.api, book); }
  update(id: number, book: Book) { return this.http.put<Book>(`${this.api}/${id}`, book); }
  delete(id: number) { return this.http.delete(`${this.api}/${id}`); }

  searchGoogle(title: string) { return this.http.get<Book[]>(`${this.api}/search?title=${encodeURIComponent(title)}`); }
  importBook(book: Book) { return this.http.post<Book>(`${this.api}/import`, book); }
}
