import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CuidatePage } from './cuidate';

@NgModule({
  declarations: [
    CuidatePage,
  ],
  imports: [
    IonicPageModule.forChild(CuidatePage),
  ],
})
export class CuidatePageModule {}
