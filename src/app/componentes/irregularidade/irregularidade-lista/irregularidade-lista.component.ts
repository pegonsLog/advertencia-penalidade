import { CommonModule, DatePipe, NgIf } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Subscription, map } from 'rxjs';
import {
  IIrregularidade,
  IIrregularidades,
} from '../../../interface/irregularidade';
import { AngularMaterialModule } from '../../../shared/angular-material/angular-material';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation/confirmation.component';
import { IrregularidadeService } from '../irregularidade.service';

@Component({
  selector: 'app-irregularidade-lista',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatSortModule,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgIf
],
  providers: [DatePipe, provideNgxMask()],
  templateUrl: './irregularidade-lista.component.html',
  styleUrl: './irregularidade-lista.component.scss',
})
export class IrregularidadeListaComponent implements OnDestroy, OnInit {
  #irregularidadeService = inject(IrregularidadeService);
  #route = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  isLoading = true;
  numeroNotificacao = '';
  dataInicio: string = '';
  dataFim: string = '';
  tipo: string = '';
  numNotificacao: string = '';
  porNumero: string = '';
  porPeriodo: string = '';

  filtradas: IIrregularidades = [];
  irregularidades: IIrregularidades = [];

  notificacoesProtocolo: string[] = [];

  irregularidade = signal<IIrregularidade>({
    id: '',
    numeroIrregularidade: '',
    matriculaAgente: '',
    dataIrregularidade: '',
    horario: '',
    local: '',
    numeroLocal: '',
    bairro: '',
    descricao: '',
    dataEmissao: '',
    prazoCumprimentoConferencia: '',
    matAgenteConferente: '',
    codigoInfracao: '',
    numeroLinha: '',
    numeroVeiculo: '',
  });

  displayedColumns: string[] = [
    'numeroIrregularidade',
    'matriculaAgente',
    'dataIrregularidade',
    'horario',
    'local',
    'bairro',
    'descricao',
    'matAgenteConferente',
    'dataEmissao',
    'prazoCumprimentoConferencia',
    'codigoInfracao',
    'numeroLinha',
    'numeroVeiculo',
    'actions',
  ];
  dataSource = new MatTableDataSource(this.irregularidades);
  contador = 0;
  dataConferencia: string = '';

  subscription: Subscription = new Subscription();


  constructor() {
    this.porNumero = this.#activatedRoute.snapshot.queryParams['ehPorNumero'];
    this.porPeriodo = this.#activatedRoute.snapshot.queryParams['ehPorPeriodo'];

    this.dataFim = this.#activatedRoute.snapshot.queryParams['dataFim'];
    this.dataInicio = this.#activatedRoute.snapshot.queryParams['dataInicio'];

    if (this.porNumero) {
      this.numNotificacao =
        this.#activatedRoute.snapshot.queryParams['numeroNotificacao'];
      this.carregarListaPorNumeroNotificacao(this.numNotificacao);
      return;
    }

    if (this.porPeriodo) {
      this.#irregularidadeService
        .list()
        .pipe(
          map((irregs: IIrregularidades) =>
            irregs.forEach((irreg: IIrregularidade) => {
              if (
                this.formatDate(irreg.prazoCumprimentoConferencia) >=
                  this.formatDate(this.dataInicio) &&
                this.formatDate(irreg.prazoCumprimentoConferencia) <=
                  this.formatDate(this.dataFim)
              ) {
                this.dataSource.data.push(irreg);
              }
            })
          )
        )
        .subscribe(() => {
          this.contador = this.dataSource.data.length;
          this.isLoading = false;
        });
    }
  }

  ngOnInit(): void {}

  add() {
    this.#route.navigate(['irregularidadeAdicionar']);
  }

  edit(id: string) {
    this.dataSource.data = [];
    this.#route.navigate(['irregularidadeAlterar'], {
      queryParams: {
        id: id,
        dataInicio: this.dataInicio,
        dataFim: this.dataFim,
        tipo: 'lote',
        ehPorPeriodo: this.porPeriodo,
        ehPorNumero: this.porNumero,
      },
    });
  }

  delete(id: string) {
    const dialogReference = this.dialog.open(ConfirmationDialogComponent);
    this.subscription = dialogReference.afterClosed().subscribe(() =>
      this.#irregularidadeService
        .deleteIrregularidade(id)
        .then(() => {
          this.filtradas = [];
          this.#irregularidadeService
            .list()
            .pipe(
              map((irregs: IIrregularidades) =>
                irregs.forEach((irreg: IIrregularidade) => {
                  if (
                    this.formatDate(irreg.dataIrregularidade) >=
                      this.formatDate(this.dataInicio) &&
                    this.formatDate(irreg.dataIrregularidade) <=
                      this.formatDate(this.dataFim)
                  ) {
                    this.filtradas.push(irreg);
                  }
                })
              )
            )
            .subscribe(() => {
              this.dataSource = new MatTableDataSource(this.filtradas);
              this.contador = this.filtradas.length;
              this.isLoading = false;
            });
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  voltar() {
    this.#route.navigate(['parametros']);
  }

  limpar(){
    this.filtradas = [];
    this.dataSource = new MatTableDataSource(this.irregularidades);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.contador = this.dataSource._filterData(this.irregularidades).length;
  }

  ngOnDestroy(): void {
    this.limpar();
    this.subscription.unsubscribe();
  }
  imprimir() {
    const url = this.#route.serializeUrl(
      this.#route.createUrlTree(['imprimir'], {
        queryParams: {
          dataInicio: this.dataInicio,
          dataFim: this.dataFim,
          tipo: 'lote',
        },
      })
    );
    window.open(url, '_blank');
  }
  imprimirUma(numeroNotificacao: string) {
    const url = this.#route.serializeUrl(
      this.#route.createUrlTree(['imprimir'], {
        queryParams: { numeroNotificacao: numeroNotificacao, tipo: 'unitaria' },
      })
    );
    window.open(url, '_blank');
  }

  carregarListaPorNumeroNotificacao(numeroNotif: string) {
    const numeroNotificacao = numeroNotif;
    this.#activatedRoute.snapshot.queryParams['numeroNotificacao'];
    this.#irregularidadeService
      .list()
      .pipe(
        map((i: IIrregularidades) =>
          i.filter(
            (irreg) =>
              irreg.numeroIrregularidade.toString() == numeroNotificacao
          )
        )
      )
      .subscribe((irregularidades: IIrregularidades) => {
        this.irregularidades = irregularidades;
        this.dataSource = new MatTableDataSource(this.irregularidades);
        this.contador = irregularidades.length;
        this.isLoading = false;
      });
  }

  formatDate(dateString: string): Date {
    let [day, month, year] = dateString.split('/').map(Number);
    let date = new Date(year, month - 1, day);
    return date;
  }

  imprimirProtocolo() {
    for (let f of this.filtradas) {
      this.notificacoesProtocolo.push(f.numeroIrregularidade);
    }
    const url = this.#route.serializeUrl(
      this.#route.createUrlTree(['imprimirProtocolo'], {
        queryParams: {
          dataInicio: this.dataInicio,
          dataFim: this.dataFim,
          dataConferencia: this.dataConferencia,
          tipo: 'porLote',
        },
      })
    );
    window.open(url, '_blank');
    this.notificacoesProtocolo = [];
  }
  imprimirProtocoloUnitaria() {
    const notific: any =
      this.#activatedRoute.snapshot.queryParams['numeroNotificacao'];
    this.notificacoesProtocolo.push(notific);
    const url = this.#route.serializeUrl(
      this.#route.createUrlTree(['imprimirProtocolo'], {
        queryParams: {
          protocolosNotificacao: this.notificacoesProtocolo,
          dataConferencia: this.dataConferencia,
          tipo: 'unitaria',
        },
      })
    );
    window.open(url, '_blank');
    this.notificacoesProtocolo = [];
  }
}
