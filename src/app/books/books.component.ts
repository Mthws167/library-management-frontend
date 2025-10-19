import { Component, OnInit } from '@angular/core';
import { BooksService, Book } from '../services/books.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-books',
  template: `
  <mat-card class="list-card">
    <mat-card-header>
      <mat-card-title>Livros</mat-card-title>
      <span class="spacer"></span>
      <button mat-raised-button color="primary" (click)="new()">
        <mat-icon>add</mat-icon> Novo
      </button>
    </mat-card-header>
    <mat-card-content>
      <table mat-table [dataSource]="books" class="mat-elevation-z8" style="width:100%">
        <ng-container matColumnDef="titulo">
          <th mat-header-cell *matHeaderCellDef> Título </th>
          <td mat-cell *matCellDef="let b"> {{b.titulo}} </td>
        </ng-container>
        <ng-container matColumnDef="autor">
          <th mat-header-cell *matHeaderCellDef> Autor </th>
          <td mat-cell *matCellDef="let b"> {{b.autor}} </td>
        </ng-container>
        <ng-container matColumnDef="categoria">
          <th mat-header-cell *matHeaderCellDef> Categoria </th>
          <td mat-cell *matCellDef="let b"> {{b.categoria}} </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Ações </th>
          <td mat-cell *matCellDef="let b">
            <button mat-icon-button color="accent" (click)="edit(b.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="remove(b.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card-content>
  </mat-card>
  `,
  styles: [`
    .list-card {
      margin: 20px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    button.mat-icon-button {
      margin-left: 8px;
    }
  `]
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  displayedColumns = ['titulo','autor','categoria','actions'];
  constructor(private booksService: BooksService, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }
  load(){ this.booksService.list().subscribe(b=> this.books = b); }
  new(){ this.router.navigate(['/books/new']); }
  edit(id?: number){ this.router.navigate(['/books', id, 'edit']); }
  remove(id?: number){ this.booksService.delete(id!).subscribe(()=>{ this.snack.open('Removido','OK',{duration:2000}); this.load(); }); }
}