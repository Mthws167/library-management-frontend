
import { Component, OnInit } from '@angular/core';
import { UsersService, User } from '../services/users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  template: `
  <mat-card>
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2>Usuários</h2>
      <button mat-raised-button color="primary" (click)="new()">Novo</button>
    </div>
    <table mat-table [dataSource]="users" class="mat-elevation-z8" style="width:100%">
      <ng-container matColumnDef="nome">
        <th mat-header-cell *matHeaderCellDef> Nome </th>
        <td mat-cell *matCellDef="let u"> {{u.nome}} </td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef> Email </th>
        <td mat-cell *matCellDef="let u"> {{u.email}} </td>
      </ng-container>
      <ng-container matColumnDef="telefone">
        <th mat-header-cell *matHeaderCellDef> Telefone </th>
        <td mat-cell *matCellDef="let u"> {{u.telefone}} </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Ações </th>
        <td mat-cell *matCellDef="let u">
          <button mat-button (click)="edit(u.id)">Editar</button>
          <button mat-button color="warn" (click)="remove(u.id)">Excluir</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </mat-card>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['nome','email','telefone','actions'];
  constructor(private usersService: UsersService, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }
  load(){ this.usersService.list().subscribe(u=> this.users = u); }
  new(){ this.router.navigate(['/users/new']); }
  edit(id?: number){ this.router.navigate(['/users', id, 'edit']); }
  remove(id?: number){ this.usersService.delete(id!).subscribe(()=>{ this.snack.open('Removido','OK',{duration:2000}); this.load(); }); }
}
