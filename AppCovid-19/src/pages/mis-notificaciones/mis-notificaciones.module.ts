import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisNotificacionesPage } from './mis-notificaciones';

@NgModule({
  declarations: [
    MisNotificacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisNotificacionesPage),
  ],
})
export class MisNotificacionesPageModule {}
