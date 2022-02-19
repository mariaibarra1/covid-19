import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimerResultadoPage } from './primer-resultado';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    PrimerResultadoPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimerResultadoPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDSVmDjbmmdQD_3B5NEZcO5lNsujDMzO2g",
      libraries: ["places"]
    }),
  ],
})
export class PrimerResultadoPageModule {}
