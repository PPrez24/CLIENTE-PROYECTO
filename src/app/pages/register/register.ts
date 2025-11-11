import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { HighlightDirective } from '../../shared/directives/highlight';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, Header, Footer, HighlightDirective],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name=''; email=''; password='';
}