
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface User { id?: number; nome: string; email: string; dataCadastro: string; telefone: string; }

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) { }

  list(): Observable<User[]> { return this.http.get<User[]>(this.api); }
  get(id: number) { return this.http.get<User>(`${this.api}/${id}`); }
  create(user: User) { return this.http.post<User>(this.api, user); }
  update(id: number, user: User) { return this.http.put<User>(`${this.api}/${id}`, user); }
  delete(id: number) { return this.http.delete(`${this.api}/${id}`); }
}
