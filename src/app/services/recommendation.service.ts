
import { Injectable } from '@angular/core';
import { BooksService } from './books.service';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private booksService: BooksService) { }

  recommendByCategory(categoria: string) {
    return this.booksService.list();
  }
}
