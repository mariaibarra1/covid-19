import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App } from 'ionic-angular';
import { ServicioNotificaciones } from '../../services/notificaciones.service';
import { NotificacionModel } from '../../models/notificacion.model';
import { UsuarioModel } from '../../models/usuario.model';
import { TabsPage } from '../tabs/tabs';
import { enum_ca_notificaciones } from '../../utilities/constants';
import { NotificacionDetallePage } from './notificacion-detalle/notificacion-detalle';

@IonicPage()
@Component({
  selector: 'page-mis-notificaciones',
  templateUrl: 'mis-notificaciones.html',
})
export class MisNotificacionesPage {

  public notificaciones: Array<NotificacionModel> = [];
  public usuario: UsuarioModel;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private servicioNotificaciones: ServicioNotificaciones,
    private events: Events,
    private app: App) {

    this.notificaciones = this.navParams.get("notificaciones");
    this.usuario = this.navParams.get("usuario");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLeave() {
    this.events.publish("actualizarNotificaciones");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async marcarNotificacionComoLeida(notificacion: NotificacionModel) {
    if (notificacion.notificacion_visto == true)
      return;

    notificacion.notificacion_visto = true;
    await this.servicioNotificaciones.editarNotificacion(notificacion);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async detalleNotificacion(notificacion: NotificacionModel) {
    await this.marcarNotificacionComoLeida(notificacion);
    this.navCtrl.push(NotificacionDetallePage, { notificacion: notificacion });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async detalleNotificacionFuncional(notificacion: NotificacionModel) {
    await this.marcarNotificacionComoLeida(notificacion);

    let nombreTab: string;
    switch (notificacion.idCNotificacion) {
      case enum_ca_notificaciones.aviso: nombreTab = "avisos"; break;
      case enum_ca_notificaciones.revision: nombreTab = "avisos"; break;
      case enum_ca_notificaciones.seguimieto: nombreTab = "avisos"; break;
      default: nombreTab = "ajustes"; break;
    }
    this.navCtrl.pop();
    this.app.getRootNav().setRoot(TabsPage, { nombreTab: nombreTab });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async refrescarNotificaciones(refresher) {
    let notificaciones = await this.servicioNotificaciones.obtenerNotificacionesPorIdUsuario(this.usuario.idUsuario);
    if (notificaciones == null)
      return;

    this.notificaciones = notificaciones;
    refresher.complete();
  }

}
