
import { Component, OnInit } from '@angular/core';
import { BooksService, Book } from '../services/books.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-books',
  template: `
  <mat-card>
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2>Livros</h2>
      <button mat-raised-button color="primary" (click)="new()">Novo</button>
    </div>
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
          <button mat-button (click)="edit(b.id)">Editar</button>
          <button mat-button color="warn" (click)="remove(b.id)">Excluir</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </mat-card>
  `
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
