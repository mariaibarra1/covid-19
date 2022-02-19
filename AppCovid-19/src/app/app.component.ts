import { PermisosPage } from './../pages/permisos/permisos';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServicioUtilidades } from '../services/utilidades.service';
import { ServicioInactividad } from '../services/inactividad.service';
import { PRODUCCION } from './ambiente';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = PermisosPage;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public platform: Platform,
    private servicioUtilidades: ServicioUtilidades,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private servicioInactividad: ServicioInactividad,
  ) {
    this.servicioInactividad.inicializarListeners();
    this.initializeApp();

    if (PRODUCCION == false)
      this.servicioUtilidades.toast("Ambiente de pruebas", "middle");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
