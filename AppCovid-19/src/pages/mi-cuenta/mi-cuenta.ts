import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { ServicioUtilidades } from '../../services/utilidades.service';

@IonicPage()
@Component({
  selector: 'page-mi-cuenta',
  templateUrl: 'mi-cuenta.html',
})
export class MiCuentaPage {

  public usuario: UsuarioModel;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthenticationService,
    private servicioUtilidades: ServicioUtilidades,
    private app: App) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidEnter() {
    this.usuario = JSON.parse(localStorage.getItem("user"));
    console.log(this.usuario);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async cerrarSesion() {
    let confirm = await this.servicioUtilidades.mensajeDeConfirmacion("¿Desea cerrar sesión", "");
    if (confirm) {
      this.authService.logout(this.usuario);
      this.app.getRootNav().setRoot(LoginPage);

    }
  }

}
