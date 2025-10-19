import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  template: `
  <mat-card class="form-card">
    <mat-card-header>
      <mat-card-title>{{ isEdit ? 'Editar' : 'Novo' }} Usuário</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="telefone" phoneMask placeholder="(XX)XXXXX-XXXX">
          <mat-error *ngIf="form.get('telefone')?.hasError('pattern')">Formato: (XX)XXXXX-XXXX</mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Data Cadastro</mat-label>
          <input matInput formControlName="dataCadastro" placeholder="YYYY-MM-DD">
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
    mat-card-title {
      color: white;
    }
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
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  constructor(private fb: FormBuilder, private usersService: UsersService, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\d{5}-\d{4}$/)]],
      dataCadastro: ['']
    });
    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      if (id) {
        this.isEdit = true;
        this.id = Number(id);
        this.usersService.get(this.id).subscribe(u => this.form.patchValue(u));
      }
    });
  }
  save() {
    const value = this.form.value;

    if (this.isEdit) {
      this.usersService.update(this.id!, value).subscribe({
        next: () => {
          this.snack.open('Usuário atualizado com sucesso!', 'OK', { duration: 2000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          const message = err.error?.error || 'Erro ao atualizar o usuário.';
          this.snack.open(message, 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.usersService.create(value).subscribe({
        next: () => {
          this.snack.open('Usuário criado com sucesso!', 'OK', { duration: 2000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          const message = err.error?.error || 'Erro ao criar o usuário.';
          this.snack.open(message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  cancel() { this.router.navigate(['/users']); }
}