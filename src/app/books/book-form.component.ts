import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BooksService } from '../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-form',
  template: `
  <mat-card class="form-card">
    <mat-card-header>
      <mat-card-title>{{ isEdit ? 'Editar' : 'Novo' }} Livro</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo">
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Autor</mat-label>
          <input matInput formControlName="autor">
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>ISBN</mat-label>
          <input matInput formControlName="isbn">
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Categoria</mat-label>
          <input matInput formControlName="categoria">
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Data Publicação</mat-label>
          <input matInput formControlName="dataPublicacao" placeholder="YYYY-MM-DD">
        </mat-form-field>
        <div class="button-group">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
            <mat-icon>save</mat-icon> Salvar
          </button>
          <button mat-button type="button" (click)="cancel()">
            <mat-icon>cancel</mat-icon> Cancelar
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
  `,
  styles: [`
    .form-card {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      gap: 8px;
    }
  `]
})
export class BookFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  constructor(private fb: FormBuilder, private booksService: BooksService, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      categoria: ['', Validators.required],
      dataPublicacao: ['']
    });
    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      if (id) { this.isEdit = true; this.id = Number(id); this.booksService.get(this.id).subscribe(b => this.form.patchValue(b)); }
    });
  }
  save() {
    const value = this.form.value;

    if (this.isEdit) {
      this.booksService.update(this.id!, value).subscribe({
        next: () => {
          this.snack.open('Atualizado com sucesso!', 'OK', { duration: 2000 });
          this.router.navigate(['/books']);
        },
        error: (err) => {
          const message = err.error?.error || 'Erro ao atualizar o livro.';
          this.snack.open(message, 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.booksService.create(value).subscribe({
        next: () => {
          this.snack.open('Criado com sucesso!', 'OK', { duration: 2000 });
          this.router.navigate(['/books']);
        },
        error: (err) => {
          const message = err.error?.error || 'Erro ao criar o livro.';
          this.snack.open(message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  cancel() { this.router.navigate(['/books']); }
}