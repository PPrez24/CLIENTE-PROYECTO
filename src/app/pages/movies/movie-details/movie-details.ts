import { Component } from '@angular/core';
import { Movie } from '../../../shared/services/movie';
import { Movie as IMovie } from '../../../shared/types/movie';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss'
})
export class MovieDetails {

  movie: IMovie = { title: '' };

  constructor(private movieService: Movie) {
    this.movie = this.movieService.getMovie();
  }

}
