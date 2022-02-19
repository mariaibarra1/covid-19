import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComentariosDetallePage } from './comentarios-detalle';

@NgModule({
  declarations: [
    ComentariosDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ComentariosDetallePage),
  ],
})
export class ComentariosDetallePageModule {}
