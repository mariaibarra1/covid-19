import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacionDetallePage } from './notificacion-detalle';

@NgModule({
  declarations: [
    NotificacionDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(NotificacionDetallePage),
  ],
})
export class NotificacionDetallePageModule {}
