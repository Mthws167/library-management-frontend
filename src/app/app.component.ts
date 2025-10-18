
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar color="primary">
    <span>Library Management</span>
    <span style="flex:1 1 auto"></span>
    <button mat-button routerLink="/users">Users</button>
    <button mat-button routerLink="/books">Books</button>
    <button mat-button routerLink="/loans">Loans</button>
    <button mat-button routerLink="/recommendations">Recommendations</button>
  </mat-toolbar>
  <div style="padding:16px">
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent { }
