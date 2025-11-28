import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Router } from '@angular/router';

interface TemplateDef {
  id: string;
  name: string;
  desc: string;
  fields: number;
}

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './templates-list.html',
  styleUrls: ['./templates-list.scss']
})
export class TemplatesList {
  constructor(private router: Router) {}

  items: TemplateDef[] = [
    {
      id: 'clases-diarias',
      name: 'Horario de clases',
      desc: 'Bloque típico de clases entre semana, ideal para horarios como 8:00–10:00 en aula.',
      fields: 6
    },
    {
      id: 'proyecto-final',
      name: 'Entrega de proyecto final',
      desc: 'Pensada para entregar proyectos grandes, con fecha y hora límite configuradas.',
      fields: 9
    }
  ];

  useTemplate(t: TemplateDef) {
    this.router.navigate(['/app/activities/new'], {
      queryParams: { template: t.id }
    });
  }
}
