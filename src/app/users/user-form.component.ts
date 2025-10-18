
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  template: `
  <mat-card>
    <h2>{{ isEdit ? 'Editar' : 'Novo' }} Usuário</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field style="width:100%"><mat-label>Nome</mat-label><input matInput formControlName="nome"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>Email</mat-label><input matInput formControlName="email"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>Telefone</mat-label><input matInput formControlName="telefone"></mat-form-field>
      <mat-form-field style="width:100%"><mat-label>Data Cadastro</mat-label><input matInput formControlName="dataCadastro" placeholder="YYYY-MM-DD"></mat-form-field>
      <div style="margin-top:12px">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Salvar</button>
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
      </div>
    </form>
  </mat-card>
  `
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  constructor(private fb: FormBuilder, private usersService: UsersService, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      dataCadastro: ['']
    });
    this.route.paramMap.subscribe(p=>{
      const id = p.get('id');
      if(id){ this.isEdit = true; this.id = Number(id); this.usersService.get(this.id).subscribe(u=> this.form.patchValue(u)); }
    });
  }
  save(){
    const value = this.form.value;
    if(this.isEdit){ this.usersService.update(this.id!, value).subscribe(()=>{ this.snack.open('Atualizado','OK',{duration:2000}); this.router.navigate(['/users']); }); }
    else { this.usersService.create(value).subscribe(()=>{ this.snack.open('Criado','OK',{duration:2000}); this.router.navigate(['/users']); }); }
  }
  cancel(){ this.router.navigate(['/users']); }
}
