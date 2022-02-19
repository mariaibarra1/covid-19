import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ServicioUtilidades } from '../../services/utilidades.service';
import { InstanciaPage } from '../instancia/instancia';
import { CoordenadaModel } from '../../models/coordenada.model';

@IonicPage()
@Component({
  selector: 'page-permisos',
  templateUrl: 'permisos.html',
})

// Componente destinado para pedir permisos a dispositivos, todos los permisos deben ser solicitados aquí.
export class PermisosPage {

  public geolocalizacion: CoordenadaModel;
  public contenidoCargado: boolean = false;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
    private servicioUtilidades: ServicioUtilidades) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewDidLoad() {
    await this.pedirPermisos();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async pedirPermisosNuevamente(refresher) {
    refresher.complete();
    await this.pedirPermisos();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async pedirPermisos() {
    this.contenidoCargado = false;

    await this.platform.ready();
    // Si es un dispositivo físico Android.
    if (this.platform.is("android") && this.platform.is("mobileweb") == false) {
      let permiso = await new Promise<any>(async (resolve, reject) => {
        // Para pedirle permisos a android es necesario primero utilizar la cosa a la que se pedirán los permisos y
        // luego revisar si en verdad se dieron los permisos.
        this.geolocalizacion = await this.servicioUtilidades.obtenerPromesaGeolocalizacion();
        let permisoLocalizacion = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        return resolve(permisoLocalizacion.hasPermission);
      });
      if (permiso == true)
        this.navCtrl.setRoot(InstanciaPage);
    } else {
      this.geolocalizacion = await this.servicioUtilidades.obtenerPromesaGeolocalizacion();
      if (this.geolocalizacion != null)
        this.navCtrl.setRoot(InstanciaPage);
    }
    this.contenidoCargado = true;
  }

}
