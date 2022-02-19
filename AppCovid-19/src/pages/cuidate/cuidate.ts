import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {PrimerEncuestaPage} from '../primer-encuesta/primer-encuesta';

@IonicPage()
@Component({
  selector: 'page-cuidate',
  templateUrl: 'cuidate.html',
})
export class CuidatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CuidatePage');
  }

  comenzar() {
    this.navCtrl.push(PrimerEncuestaPage);
  }

  pantallaLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}
