import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../services/recommendation.service';

@Component({
  selector: 'app-recommendations',
  template: `
  <mat-card class="recommendations-card">
    <mat-card-header>
      <mat-card-title>Recomendações</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div *ngFor="let rec of recommendations">
        <h3>Recomendações para {{rec.user.email}}</h3>
        <div *ngIf="rec.recommendedBooks.length > 0; else noBooks">
          <table mat-table [dataSource]="rec.recommendedBooks" class="mat-elevation-z8">
            <!-- Título Column -->
            <ng-container matColumnDef="titulo">
              <th mat-header-cell *matHeaderCellDef> Título </th>
              <td mat-cell *matCellDef="let book"> {{book.titulo}} </td>
            </ng-container>

            <!-- Autor Column -->
            <ng-container matColumnDef="autor">
              <th mat-header-cell *matHeaderCellDef> Autor </th>
              <td mat-cell *matCellDef="let book"> {{book.autor}} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
        <ng-template #noBooks>
          <p>Nenhum livro recomendado para este usuário.</p>
        </ng-template>
      </div>
    </mat-card-content>
  </mat-card>
  `,
  styles: [`
    .recommendations-card {
      margin: 20px;
    }
    table {
      width: 100%;
      margin-bottom: 16px;
    }
    th, td {
      padding: 12px;
      text-align: left;
    }
    .mat-elevation-z8 {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    h3 {
      color: #3f51b5; /* Primary color for headers */
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  recommendations: { user: { email: string }, recommendedBooks: any[] }[] = [];
  displayedColumns: string[] = ['titulo', 'autor'];

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.recommendationService.getRecommendations().subscribe(recs => {
      this.recommendations = recs;
    });
  }
}