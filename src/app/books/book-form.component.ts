
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BooksService } from '../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-form',
  template: `
  <mat-card>
    <h2>{{ isEdit ? 'Editar' : 'Novo' }} Livro</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field style="width:100%"><mat-label>Título</mat-label><input matInput formControlName="titulo"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>Autor</mat-label><input matInput formControlName="autor"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>ISBN</mat-label><input matInput formControlName="isbn"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>Categoria</mat-label><input matInput formControlName="categoria"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>Data Publicação</mat-label><input matInput formControlName="dataPublicacao" placeholder="YYYY-MM-DD"></mat-form-field>
      <div style="margin-top:12px">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Salvar</button>
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
      </div>
    </form>
  </mat-card>
  `
})
export class BookFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  constructor(private fb: FormBuilder, private booksService: BooksService, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      categoria: ['', Validators.required],
      dataPublicacao: ['']
    });
    this.route.paramMap.subscribe(p=>{
      const id = p.get('id');
      if(id){ this.isEdit = true; this.id = Number(id); this.booksService.get(this.id).subscribe(b=> this.form.patchValue(b)); }
    });
  }
  save(){
    const value = this.form.value;
    if(this.isEdit){ this.booksService.update(this.id!, value).subscribe(()=>{ this.snack.open('Atualizado','OK',{duration:2000}); this.router.navigate(['/books']); }); }
    else { this.booksService.create(value).subscribe(()=>{ this.snack.open('Criado','OK',{duration:2000}); this.router.navigate(['/books']); }); }
  }
  cancel(){ this.router.navigate(['/books']); }
}
