import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  template: `
    <app-header></app-header>
    <main class="wrap">
      <h2>Página no encontrada</h2>
      <p>La ruta no existe.</p>
      <a class="btn" routerLink="/app/dashboard">Ir al Dashboard</a>
    </main>
    <app-footer></app-footer>
  `
})
export class NotFound {}
