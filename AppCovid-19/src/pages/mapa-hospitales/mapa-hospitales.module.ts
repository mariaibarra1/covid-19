import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaHospitalesPage } from './mapa-hospitales';

@NgModule({
  declarations: [
    MapaHospitalesPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaHospitalesPage),
  ],
})
export class MapaHospitalesPageModule {}
