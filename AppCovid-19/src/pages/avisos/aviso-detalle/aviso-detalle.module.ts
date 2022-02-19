import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvisoDetallePage } from './aviso-detalle';

@NgModule({
  declarations: [
    AvisoDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(AvisoDetallePage),
  ],
})
export class AvisoDetallePageModule {}
