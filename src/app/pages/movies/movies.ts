import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MovieItem } from './movie-item/movie-item';
import { Movie } from '../../shared/services/movie';
import { Movie as IMovie } from '../../shared/types/movie';
import { Token } from '../../shared/services/token';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movies',
  imports: [CommonModule, MovieItem],
  templateUrl: './movies.html',
  styleUrl: './movies.scss'
})
export class Movies implements OnInit {
  movies: IMovie[] = [];

  constructor(private movieService: Movie, private tokenService: Token, private router: Router) {
    if (!tokenService.hasToken()) {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
    this.movieService.getAllMovies().then((movies) => {
      this.movies = movies;
    }).catch(() => {});
  }

  handleMovieSelected(movie: IMovie): void {
    this.movieService.setMovie(movie);
  }

}
