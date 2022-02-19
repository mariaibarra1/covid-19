import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComentarioTicket } from '../../../models/comentarioTicket.model';

@IonicPage()
@Component({
  selector: 'page-comentarios-detalle',
  templateUrl: 'comentarios-detalle.html',
})
export class ComentariosDetallePage {

  public comentario: ComentarioTicket;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.comentario = this.navParams.get("comentario");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLoad() {
  }

}
