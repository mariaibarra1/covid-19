import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultadoPage } from './resultado';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    ResultadoPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultadoPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDSVmDjbmmdQD_3B5NEZcO5lNsujDMzO2g",
      libraries: ["places"]
    }),
  ],
})
export class ResultadoPageModule {}
