import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroUsuarioPage } from './registro-usuario';
import { ExpandableComponent } from "../../components/components-expandable/components-expandable";

@NgModule({
  declarations: [
    RegistroUsuarioPage,
    ExpandableComponent
  ],
  imports: [
    IonicPageModule.forChild(RegistroUsuarioPage),
  ],
})
export class RegistroUsuarioPageModule { }
