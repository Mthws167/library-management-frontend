
import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../services/recommendation.service';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-recommendations',
  template: `
  <mat-card>
    <h2>Recomendações</h2>
    <p>Recomendações simples baseadas na categoria dos livros. (Backend pode expor endpoint melhor)</p>
    <div *ngFor="let b of recommended">
      <mat-card style="margin-bottom:8px">
        <h3>{{b.titulo}}</h3>
        <p>{{b.autor}} — {{b.categoria}}</p>
      </mat-card>
    </div>
  </mat-card>
  `
})
export class RecommendationsComponent implements OnInit {
  recommended: any[] = [];
  constructor(private recommendationService: RecommendationService, private booksService: BooksService) {}
  ngOnInit(): void { this.booksService.list().subscribe(b=> this.recommended = b.slice(0,5)); }
}
