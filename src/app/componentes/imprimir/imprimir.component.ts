import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { IInfracao, IInfracoes } from '../../interface/infracao';
import {
  IIrregularidade,
  IIrregularidades,
} from '../../interface/irregularidade';
import { ILinha, ILinhas } from '../../interface/linha';
import { IVeiculo, IVeiculos } from '../../interface/veiculo';
import { AngularMaterialModule } from '../../shared/angular-material/angular-material';
import { AgenteService } from '../agente/agente.service';
import { InfracaoService } from '../infracao/infracao.service';
import { IrregularidadeService } from '../irregularidade/irregularidade.service';
import { LinhaService } from '../linha/linha.service';
import { VeiculoService } from '../veiculo/veiculo.service';

@Component({
  selector: 'app-imprimir',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './imprimir.component.html',
  styleUrl: './imprimir.component.scss',
})
export class ImprimirComponent implements OnDestroy {
  #route = inject(Router);
  #irregularidadeService = inject(IrregularidadeService);
  #linhaService = inject(LinhaService);
  #infracaoService = inject(InfracaoService);
  #veiculoService = inject(VeiculoService);
  #activatedRoute = inject(ActivatedRoute);

  nomeLinha: string = '';
  descricaoInfracao: string = '';
  placaVeiculo: string = '';
  subconcessionaria: string = '';
  numeroConsorcio: string = '';

  filtradas: IIrregularidades = [];

  private subscription = new Subscription();

  public notificacoes: IIrregularidades = [];
  public irregularidade = {
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
    matAgenteConferente: '',
    prazoCumprimentoConferencia: '',
    codigoInfracao: '',
    numeroLinha: '',
    numeroVeiculo: '',
  };

  constructor() {
    const numeroNotificacao =
      this.#activatedRoute.snapshot.queryParams['numeroNotificacao'];
    const dataInicio = this.#activatedRoute.snapshot.queryParams['dataInicio'];
    const dataFim = this.#activatedRoute.snapshot.queryParams['dataFim'];
    const tipo = this.#activatedRoute.snapshot.queryParams['tipo'];

    if (tipo == 'unitaria') {
      this.#irregularidadeService
        .list()
        .pipe(
          map((irregs: IIrregularidades) =>
            irregs.forEach((irreg: IIrregularidade) => {
              if (irreg.numeroIrregularidade == numeroNotificacao) {
                this.filtradas.push(irreg);
                this.validarLinha(irreg.numeroLinha);
                this.validarInfracao(irreg.codigoInfracao);
                this.validarVeiculo(irreg.numeroVeiculo, irreg);
              }
            })
          )
        )
        .subscribe(() => {
          console.log(this.filtradas);
        });
    }

    if (tipo == 'lote') {
      this.#irregularidadeService
        .list()
        .pipe(
          map((irregs: IIrregularidades) =>
            irregs.forEach((irreg: IIrregularidade) => {
              if (
                this.formatDate(irreg.prazoCumprimentoConferencia) >=
                  this.formatDate(dataInicio) &&
                this.formatDate(irreg.prazoCumprimentoConferencia) <=
                  this.formatDate(dataFim)
              ) {
                this.filtradas.push(irreg);
                // this.validarAgente(irreg.matriculaAgente);
                this.validarLinha(irreg.numeroLinha);
                this.validarInfracao(irreg.codigoInfracao);
                this.validarVeiculo(irreg.numeroVeiculo, irreg);
              }
            })
          )
        )
        .subscribe(() => {
          console.log(this.filtradas);
        });
    }
  }

  voltar() {
    this.#route.navigate(['home']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  carregarListaPorNumeroNotificacao(numeroNotificacao: string) {
    this.#activatedRoute.snapshot.queryParams['numeroNotificacao'];
    this.#irregularidadeService
      .list()
      .pipe(
        map((i: IIrregularidades) =>
          i.filter((irreg) => {
            irreg.numeroIrregularidade.toString() == numeroNotificacao;
          })
        )
      )
      .subscribe(() => {});
  }

  formatDate(dateString: string): Date {
    let [day, month, year] = dateString.split('/').map(Number);
    let date = new Date(year, month - 1, day);
    return date;
  }

  validarLinha(numeroLinha: string) {
    this.subscription = this.#linhaService
      .list()
      .pipe(
        map((linhas: ILinhas) =>
          linhas.forEach((linha: ILinha) => {
            if (linha.numeroLinha == numeroLinha) {
              this.nomeLinha = linha.nomeLinha;
            }
          })
        )
      )
      .subscribe(() => {});
  }

  validarInfracao(codigoInfracao: string) {
    this.subscription = this.#infracaoService
      .list()
      .pipe(
        map((infracoes: IInfracoes) =>
          infracoes.forEach((infracao: IInfracao) => {
            if (infracao.codigoInfracao == codigoInfracao) {
              this.descricaoInfracao = infracao.nomeInfracao;
            }
          })
        )
      )
      .subscribe(() => {});
  }

  // validarVeiculo(numeroVeiculo: string) {
  //   this.subscription = this.#veiculoService
  //     .list()
  //     .pipe(
  //       map((veiculos: IVeiculos) =>
  //         veiculos.forEach((veiculo: IVeiculo) => {
  //           if (veiculo.numeroVeiculo == numeroVeiculo) {
  //             this.placaVeiculo = veiculo.placa;
  //             this.subconcessionaria = veiculo.operadora;
  //             this.numeroConsorcio = veiculo.consorcio;
  //           }
  //         })
  //       )
  //     )
  //     .subscribe(() => {});
  // }

  validarVeiculo(numeroVeiculo: string, irreg: IIrregularidade) {
    this.#veiculoService.getByNumeroVeiculo(numeroVeiculo)
      .subscribe((veiculo: IVeiculo | undefined) => {
        if (veiculo) {
          irreg.placaVeiculo = veiculo.placa;
          irreg.subconcessionaria = veiculo.operadora;
          irreg.numeroConsorcio = veiculo.consorcio;
        }
      });
  }

}
