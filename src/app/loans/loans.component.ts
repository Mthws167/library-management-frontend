import { Component, OnInit } from '@angular/core';
import { LoansService } from '../services/loans.service';
import { UsersService } from '../services/users.service';
import { BooksService } from '../services/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loans',
  template: `
  <mat-card>
    <h2>Empréstimos</h2>
    <div style="display:flex; gap:8px; align-items:flex-end">
      <mat-form-field><mat-label>Usuário</mat-label><mat-select [(value)]="selectedUserId">
        <mat-option *ngFor="let u of users" [value]="u.id">{{u.nome}}</mat-option>
      </mat-select></mat-form-field>
      <mat-form-field><mat-label>Livro</mat-label><mat-select [(value)]="selectedBookId">
        <mat-option *ngFor="let b of books" [value]="b.id">{{b.titulo}}</mat-option>
      </mat-select></mat-form-field>
      <button mat-raised-button color="primary" (click)="createLoan()">Emprestar</button>
    </div>
    <h3 style="margin-top:16px">Empréstimos Atuais</h3>
    <table mat-table [dataSource]="loans" class="mat-elevation-z8" style="width:100%">
      <ng-container matColumnDef="usuario">
        <th mat-header-cell *matHeaderCellDef> Usuário </th>
        <td mat-cell *matCellDef="let l"> {{l.nomeUsuario}} </td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef> Email </th>
        <td mat-cell *matCellDef="let l"> {{l.email}} </td>
      </ng-container>
      <ng-container matColumnDef="telefone">
        <th mat-header-cell *matHeaderCellDef> Telefone </th>
        <td mat-cell *matCellDef="let l"> {{l.telefone}} </td>
      </ng-container>
      <ng-container matColumnDef="livro">
        <th mat-header-cell *matHeaderCellDef> Livro </th>
        <td mat-cell *matCellDef="let l"> {{l.nomeLivro}} </td>
      </ng-container>
      <ng-container matColumnDef="autor">
        <th mat-header-cell *matHeaderCellDef> Autor </th>
        <td mat-cell *matCellDef="let l"> {{l.autorLivro}} </td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef> Status </th>
        <td mat-cell *matCellDef="let l"> {{l.status}} </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Ações </th>
        <td mat-cell *matCellDef="let l">
          <button mat-button (click)="returnLoan(l.id)">Registrar Devolução</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </mat-card>
  `
})
export class LoansComponent implements OnInit {
  users: any[] = [];
  books: any[] = [];
  loans: any[] = [];
  selectedUserId?: number;
  selectedBookId?: number;
  displayedColumns = ['usuario', 'email', 'telefone', 'livro', 'autor', 'status', 'actions'];
  constructor(private loansService: LoansService, private usersService: UsersService, private booksService: BooksService, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); this.usersService.list().subscribe(u=> this.users = u); this.booksService.list().subscribe(b=> this.books = b); }
  load(){ this.loansService.list().subscribe(l=> this.loans = l); }
  createLoan(){ if(this.selectedUserId && this.selectedBookId){ this.loansService.create({userId:this.selectedUserId, bookId:this.selectedBookId}).subscribe(()=>{ this.snack.open('Emprestado','OK',{duration:2000}); this.load(); }); } }
  returnLoan(id?: number){ this.loansService.updateStatus(id!, 'RETURNED').subscribe(()=>{ this.snack.open('Devolvido','OK',{duration:2000}); this.load(); }); }
}