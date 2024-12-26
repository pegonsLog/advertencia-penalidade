import { Routes } from '@angular/router';
import { canActivateGuard } from './guard/can-activate.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./componentes/home/home.component').then((m) => m.HomeComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'parametros',
    loadComponent: () =>
      import('./componentes/parametros/parametros.component').then(
        (m) => m.ParametrosComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'userLista',
    loadComponent: () =>
      import('./user/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'userForm',
    loadComponent: () =>
      import('./user/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'fiscalizacaoLista',
    loadComponent: () =>
      import(
        './componentes/fiscalizacao/fiscalizacao-lista/fiscalizacao-lista.component'
      ).then((m) => m.FiscalizacaoListaComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'fiscalizacaoForm',
    loadComponent: () =>
      import(
        './componentes/fiscalizacao/fiscalizacao-form/fiscalizacao-form.component'
      ).then((m) => m.FiscalizacaoFormComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'infracaoForm',
    loadComponent: () =>
      import(
        './componentes/infracao/infracao-form/infracao-form.component'
      ).then((m) => m.InfracaoFormComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'infracaoLista',
    loadComponent: () =>
      import(
        './componentes/infracao/infracao-lista/infracao-lista.component'
      ).then((m) => m.InfracaoListaComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'irregularidadeAdicionar',
    loadComponent: () =>
      import(
        './componentes/irregularidade/irregularidade-adicionar/irregularidade-adicionar.component'
      ).then((m) => m.IrregularidadeAdicionarComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'irregularidadeAlterar',
    loadComponent: () =>
      import(
        './componentes/irregularidade/irregularidade-alterar/irregularidade-alterar.component'
      ).then((m) => m.IrregularidadeAlterarComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'irregularidadeLista',
    loadComponent: () =>
      import(
        './componentes/irregularidade/irregularidade-lista/irregularidade-lista.component'
      ).then((m) => m.IrregularidadeListaComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'linhaForm',
    loadComponent: () =>
      import('./componentes/linha/linha-form/linha-form.component').then(
        (m) => m.LinhaFormComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'linhaLista',
    loadComponent: () =>
      import('./componentes/linha/linha-lista/linha-lista.component').then(
        (m) => m.LinhaListaComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'veiculoForm',
    loadComponent: () =>
      import('./componentes/veiculo/veiculo-form/veiculo-form.component').then(
        (m) => m.VeiculoFormComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'veiculoLista',
    loadComponent: () =>
      import(
        './componentes/veiculo/veiculo-lista/veiculo-lista.component'
      ).then((m) => m.VeiculoListaComponent),
    canActivate: [canActivateGuard],
  },
  {
    path: 'agenteForm',
    loadComponent: () =>
      import('./componentes/agente/agente-form/agente-form.component').then(
        (m) => m.AgenteFormComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'agenteLista',
    loadComponent: () =>
      import('./componentes/agente/agente-lista/agente-lista.component').then(
        (m) => m.AgenteListaComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'imprimir',
    loadComponent: () =>
      import('./componentes/imprimir/imprimir.component').then(
        (m) => m.ImprimirComponent
      ),
    canActivate: [canActivateGuard],
  },
  {
    path: 'imprimirProtocolo',
    loadComponent: () =>
      import(
        './componentes/imprimir-protocolo/imprimir-protocolo.component'
      ).then((m) => m.ImprimirProtocoloComponent),
    canActivate: [canActivateGuard],
  },
];
