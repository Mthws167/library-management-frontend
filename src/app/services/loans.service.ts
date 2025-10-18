
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Loan { id?: number; usuarioId: number; livroId: number; dataEmprestimo?: string; dataDevolucao?: string; status?: string; }

@Injectable({ providedIn: 'root' })
export class LoansService {
  private api = `${environment.apiUrl}/loans`;
  constructor(private http: HttpClient) { }

  list(): Observable<Loan[]> { return this.http.get<Loan[]>(this.api); }
  create(loan: { userId: number, bookId: number }) { return this.http.post(this.api, loan); }
  updateStatus(id: number, status: string, dataDevolucao?: string) { return this.http.put(`${this.api}/${id}`, { status, dataDevolucao }); }
  listByUser(userId: number) { return this.http.get<Loan[]>(`${this.api}/user/${userId}`); }
}
