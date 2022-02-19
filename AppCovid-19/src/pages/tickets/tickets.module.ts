import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketsPage } from './tickets';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    TicketsPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketsPage),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDSVmDjbmmdQD_3B5NEZcO5lNsujDMzO2g",
      libraries: ["places"]
    }),
  ],
})
export class TicketsPageModule { }
