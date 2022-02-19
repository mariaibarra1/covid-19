import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthenticationService } from '../../services/authentication.service';
import { TabsPage } from '../tabs/tabs';
import { enum_tabs } from '../../utilities/constants';


@IonicPage()
@Component({
  selector: 'page-resultado-seguimiento',
  templateUrl: 'resultado-seguimiento.html',
})
export class ResultadoSeguimientoPage {

  icon: string;
  contenidoModerado = false;
  contenidoAlto = false;
  contenidoMuyAlto = false;
  LoggedUser = new UsuarioModel;
  numeroTelefono: string;
  nombreCaso: string;
  folioTicket: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthenticationService,
    private app: App

  ) {
    this.nombreCaso = this.navParams.get('caso');
    console.log(this.nombreCaso);
    this.folioTicket = this.navParams.get('folio') ? this.navParams.get('folio') : '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultadoSeguimientoPage');
  }

  async ionViewWillEnter() {
    this.cleanContenido();
    this.getIcon(this.nombreCaso);
    this.getuserData();
  }
  public async getuserData() {
    let user = this.authService.getUserLocalStorage();
    if (user) {
      this.LoggedUser = user;
    } else {
      this.LoggedUser.idUsuario = 0;
      this.LoggedUser.nombre = '';
      this.LoggedUser.telefono = 'S/N';
      this.LoggedUser.email = '';
    }
    let userMovil = await this.authService.getUserByEmail(this.LoggedUser.email);
    if (userMovil) {
      if (userMovil[0]) {
        this.numeroTelefono = userMovil[0].telefono;
      }
    }
    console.log(userMovil);
  }
  public getIcon(nombre: string) {
    console.log('nombre del caso::' + nombre);
    switch (nombre.toUpperCase()) {
      case 'BAJO':
        this.icon = 'assets/icon/r_bajo.svg';
        break;
      case 'MODERADO':
        this.icon = 'assets/icon/r_moderado.svg';
        this.contenidoModerado = true;
        break;
      case 'ALTO':
        this.icon = 'assets/icon/r_alto.svg';
        this.contenidoAlto = true;
        break;
      case 'MUY ALTO':
        this.icon = 'assets/icon/r_muy_alto.svg';
        this.contenidoMuyAlto = true;
        break;
    }
    console.log('icono::::' + this.icon);
  }
  public cleanContenido() {
    this.contenidoModerado = false;
    this.contenidoAlto = false;
    this.contenidoMuyAlto = false;
    this.numeroTelefono = '';
  }

  public regresar() {
    this.app.getRootNav().setRoot(TabsPage, { tabIndex: enum_tabs.inicio });
  }
}
