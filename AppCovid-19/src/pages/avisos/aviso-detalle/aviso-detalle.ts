import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AvisoModel } from '../../../models/aviso.model';


@IonicPage()
@Component({
  selector: 'page-aviso-detalle',
  templateUrl: 'aviso-detalle.html',
})
export class AvisoDetallePage {

  public aviso: AvisoModel;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.aviso = this.navParams.get("aviso");
    console.log("aviso");
    console.log(this.aviso);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLoad() {

  }

}
