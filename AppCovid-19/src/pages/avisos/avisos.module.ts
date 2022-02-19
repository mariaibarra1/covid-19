import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvisosPage } from './avisos';

@NgModule({
  declarations: [
    AvisosPage,
  ],
  imports: [
    IonicPageModule.forChild(AvisosPage),
  ],
})
export class AvisosPageModule {}
