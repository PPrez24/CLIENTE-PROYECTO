import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {}