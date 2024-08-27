import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title-component',
  standalone: false,
  templateUrl: './title-component.component.html',
  styleUrl: './title-component.component.scss'
})
export class TitleComponentComponent  {
    @Input() titulo: string = '';
    @Input() iconClass = 'fa fa-user';
    @Input() subtitulo = 'Desde 2024';
    @Input() botaoListar = false;

    constructor(private router: Router){}

    ngOnInit(): void{}

    listar(): void {
      this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`]);

    }

}
