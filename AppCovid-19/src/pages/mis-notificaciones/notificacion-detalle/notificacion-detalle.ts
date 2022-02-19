import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificacionModel } from '../../../models/notificacion.model';

@IonicPage()
@Component({
  selector: 'page-notificacion-detalle',
  templateUrl: 'notificacion-detalle.html',
})
export class NotificacionDetallePage {

  public notificacion: NotificacionModel;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.notificacion = this.navParams.get("notificacion");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLoad() {
  }

}
