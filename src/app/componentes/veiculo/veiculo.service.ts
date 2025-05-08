import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { IVeiculo, IVeiculos } from '../../interface/veiculo';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  firestore: Firestore = inject(Firestore);

  veiculos: IVeiculos = [];
  veiculo: IVeiculo = {
    id: '',
    numeroVeiculo: '',
    placa: '',
    operadora: '',
    consorcio: '',
  };
  id: string = '';

  list() {
    let $veiculosRef = collection(this.firestore, 'veiculos');
    return collectionData($veiculosRef, {
      idField: 'id',
    }) as Observable<IVeiculos>;
  }

  umVeiculo(id: string) {
    let $veiculoRef = doc(this.firestore, 'veiculos', id);
    return docData($veiculoRef, {
      idField: 'id',
    }) as Observable<IVeiculo>;
  }

  async addVeiculo(veiculo: IVeiculo) {
    let $veiculoRef = collection(this.firestore, 'veiculos');
    return addDoc($veiculoRef, veiculo);
  }

  async updateVeiculo(veiculo: IVeiculo) {
    const $veiculoRef = doc(this.firestore, 'veiculos', veiculo.id);
    await updateDoc($veiculoRef, {
      numeroVeiculo: veiculo.numeroVeiculo,
      placa: veiculo.placa,
      operadora: veiculo.operadora,
      consorcio: veiculo.consorcio,
    });
  }

  async deleteVeiculo(id: string) {
    let $veiculoRef = doc(this.firestore, 'veiculos', id);

    return deleteDoc($veiculoRef);
  }

  // veiculo.service.ts
getByNumeroVeiculo(numeroVeiculo: string): Observable<IVeiculo | undefined> {
  return this.list().pipe(
    map((veiculos: IVeiculos) =>
      veiculos.find((veiculo: IVeiculo) => veiculo.numeroVeiculo === numeroVeiculo)
    )
  );
}
}
