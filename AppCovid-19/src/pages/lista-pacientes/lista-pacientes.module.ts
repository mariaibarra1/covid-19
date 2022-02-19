import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaPacientesPage } from './lista-pacientes';

@NgModule({
  declarations: [
    ListaPacientesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaPacientesPage),
  ],
})
export class ListaPacientesPageModule {}
