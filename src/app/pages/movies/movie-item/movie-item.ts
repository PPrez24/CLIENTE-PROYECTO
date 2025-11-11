import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Movie } from '../../../shared/types/movie';

@Component({
  selector: 'app-movie-item',
  imports: [RouterModule],
  templateUrl: './movie-item.html',
  styleUrl: './movie-item.scss'
})
export class MovieItem {
  @Input() movie: Movie = { title: '' };

  @Output() onSelected: EventEmitter<Movie> = new EventEmitter();

  selectMovie() {
    this.onSelected.emit(this.movie);
  }
}
