import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePacientePage } from './detalle-paciente';

@NgModule({
  declarations: [
    DetallePacientePage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePacientePage),
  ],
})
export class DetallePacientePageModule {}
