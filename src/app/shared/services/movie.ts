import { Injectable } from '@angular/core';
import { Movie as IMovie } from '../types/movie';

@Injectable({
  providedIn: 'root'
})
export class Movie {

  private movie: IMovie = { title: '' };

  private movies: IMovie[] = [
    { title: 'Movie 1' },
    { title: 'Movie 2' },
    { title: 'Movie 3' }
  ];

  getMovie(): IMovie {
    return this.movie.title ? this.movie : JSON.parse(localStorage.getItem('movie') || '');
  }

  setMovie(movie: IMovie): void {
    this.movie = movie;
    localStorage.setItem('movie', JSON.stringify(movie));
  }

  //Funcion mockup
  getAllMovies(): Promise<IMovie[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.movies);
      }, 1000);
    });
  }

}
