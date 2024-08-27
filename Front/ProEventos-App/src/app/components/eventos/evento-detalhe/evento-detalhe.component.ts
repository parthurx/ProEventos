import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css'],
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as Evento;
  form!: FormGroup;
  saveState = 'post';
  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localService: BsLocaleService,
    private router: ActivatedRoute,
    private eventService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.localService.use('pt-br');
  }

  public loadEvents(): void {
    const eventIdParam = this.router.snapshot.paramMap.get('id');
    if (eventIdParam !== null) {
      this.spinner.show();
      this.saveState = 'put';
      this.eventService.getEventoById(+eventIdParam).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento.', 'Erro!');
          console.error(error);
        },
        () => this.spinner.hide()
      );
    }
  }

  ngOnInit() {
    this.loadEvents();
    this.validation();
    const dataEventoControl = this.form.get('dataEvento');
    if (dataEventoControl) {
      // Marcar o controle como dirty e touched
      dataEventoControl.markAsDirty();

    }
  }
  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: ['', Validators.required],
    });
  }
  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento =
        this.saveState === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventService[this.saveState](this.evento).subscribe(
        () => this.toastr.success('Evento salvo com sucesso!', 'Sucesso.'),
        (error: any) => {
          console.error(error);
          console.log('Detalhes do erro:', error.error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento.', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }
}
