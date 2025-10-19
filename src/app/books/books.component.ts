import { Component, OnInit } from '@angular/core';
import { BooksService, Book } from '../services/books.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';

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
      <div class="search-form">
        <mat-form-field appearance="fill" style="width: 300px;">
          <mat-label>Buscar livro por título (Google Books)</mat-label>
          <input matInput [formControl]="searchControl">
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="searchGoogleBooks()" [disabled]="searchControl.invalid">
          <mat-icon>search</mat-icon> Buscar
        </button>
      </div>
      <div *ngIf="googleBooks.length > 0">
        <h3>Resultados da Busca no Google Books</h3>
        <table mat-table [dataSource]="googleBooks" class="mat-elevation-z8" style="width:100%">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef> Título </th>
            <td mat-cell *matCellDef="let b"> {{b.title}} </td>
          </ng-container>
          <ng-container matColumnDef="authors">
            <th mat-header-cell *matHeaderCellDef> Autor(es) </th>
            <td mat-cell *matCellDef="let b"> {{b.authors.join(', ')}} </td>
          </ng-container>
          <ng-container matColumnDef="isbn">
            <th mat-header-cell *matHeaderCellDef> ISBN </th>
            <td mat-cell *matCellDef="let b"> {{b.isbn}} </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Ações </th>
            <td mat-cell *matCellDef="let b">
              <button mat-icon-button color="accent" (click)="addFromGoogle(b)">
                <mat-icon>add</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="googleDisplayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: googleDisplayedColumns;"></tr>
        </table>
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
    mat-card-title {
      color: white;
    }
    .list-card {
      margin: 20px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    button.mat-icon-button {
      margin-left: 8px;
    }
    .search-form {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-bottom: 16px;
    }
  `]
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  displayedColumns = ['titulo', 'autor', 'categoria', 'actions'];
  googleBooks: any[] = [];
  googleDisplayedColumns = ['title', 'authors', 'isbn', 'actions'];
  searchControl = new FormControl('', Validators.required);

  constructor(private booksService: BooksService, private router: Router, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.load();
  }

  load() { 
    this.booksService.list().subscribe(b => this.books = b);
  }

  new() {
    this.router.navigate(['/books/new']);
  }

  edit(id?: number) {
    this.router.navigate(['/books', id, 'edit']);
  }

  remove(id?: number) {
    this.booksService.delete(id!).subscribe(() => { this.snack.open('Removido', 'OK', { duration: 2000 }); this.load(); });
  }

  searchGoogleBooks() {
    const title = this.searchControl.value;

    if (!title?.trim()) {
      this.snack.open('Digite um título para buscar.', 'Fechar', { duration: 2500 });
      return;
    }

    this.booksService.searchGoogleBooks(title).subscribe({
      next: (results) => {
        this.googleBooks = results;
      },
      error: (err) => {
        const message = err.error?.message || 'Erro ao buscar livros no Google Books.';
        this.snack.open(message, 'Fechar', { duration: 3000 });
      }
    });
  }


  addFromGoogle(book: any) {
    const createDto = {
      titulo: book.title,
      autor: book.authors ? book.authors.join(', ') : '',
      isbn: book.isbn,
      dataPublicacao: book.publishedDate,
      categoria: book.categories
    };

    this.booksService.create(createDto).subscribe({
      next: () => {
        this.snack.open('Livro adicionado com sucesso!', 'OK', { duration: 2000 });
        this.load();
      },
      error: (err) => {
        const message = err.error?.error || 'Erro ao adicionar o livro.';
        this.snack.open(message, 'Fechar', { duration: 3000 });
      }
    });
  }

}