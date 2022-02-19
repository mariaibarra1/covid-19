import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { MisNotificacionesPage } from '../../pages/mis-notificaciones/mis-notificaciones';
import { NotificacionModel } from '../../models/notificacion.model';
import { ServicioNotificaciones } from '../../services/notificaciones.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'notificaciones',
  templateUrl: 'notificaciones.html'
})
export class NotificacionesComponent implements OnInit {

  public intNoticacionesNoLeidas: number = 0;
  public ciudadano: any = null;
  public notificaciones: Array<NotificacionModel> = [];

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private navCtrl: NavController,
    private servicioNotificaciones: ServicioNotificaciones,
    private events: Events) {

    // Activamos este evento cuando lo necesitemos
    this.events.subscribe('actualizarNotificaciones', () => {
      this.obtenerNotificaciones();
    });

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ngOnInit() {
    await this.obtenerNotificaciones();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerNotificaciones() {
    let usuario: UsuarioModel = JSON.parse(localStorage.getItem('user'));
    if (usuario == null)
      return;

    let notificaciones = await this.servicioNotificaciones.obtenerNotificacionesPorIdUsuario(usuario.idUsuario);
    if (notificaciones == null)
      return;

    this.notificaciones = notificaciones;
    this.intNoticacionesNoLeidas = this.notificaciones.filter(not => not.notificacion_visto == false).length;



    if (this.intNoticacionesNoLeidas > 0) {
      this.servicioNotificaciones.mostrarNumeroXNotificacion(this.intNoticacionesNoLeidas);
    } else {

      this.servicioNotificaciones.limpiarNumeroXNotificacion(this.intNoticacionesNoLeidas);

    }


  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public pantallaIniciarSesion() {
    this.navCtrl.push(LoginPage);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async pantallaMisNotificaciones() {
    let usuario: UsuarioModel = JSON.parse(localStorage.getItem('user'));
    this.navCtrl.push(MisNotificacionesPage, { notificaciones: this.notificaciones, usuario: usuario });
  }

}
