import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './templates-list.html',
  styleUrls: ['./templates-list.scss']
})
export class TemplatesList {
  items = [
    { name: 'Plantilla A', desc: 'Uso general', fields: 6 },
    { name: 'Plantilla B', desc: 'Reporte semanal', fields: 9 },
  ];
}
