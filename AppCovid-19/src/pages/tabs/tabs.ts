import { CategoriasPage } from './../categorias/categorias';
import { MiCuentaPage } from './../mi-cuenta/mi-cuenta';
import { MapaHospitalesPage } from './../mapa-hospitales/mapa-hospitales';
import { Component } from '@angular/core';
import { NavParams, Events, App, NavController, Tabs } from 'ionic-angular';
import { ListaPacientesPage } from '../lista-pacientes/lista-pacientes';
import { enum_tabs } from '../../utilities/constants';
import { UsuarioModel } from '../../models/usuario.model';
import { TabModel, PermisosTabUsuarioModel } from '../../models/tab.model';
import { AuthenticationService } from '../../services/authentication.service';
import { ServicioUtilidades } from '../../services/utilidades.service';
import { LoginPage } from '../login/login';
import { AvisosPage } from '../avisos/avisos';
import { ComentariosPage } from '../comentarios/comentarios';
import { PRODUCCION } from '../../app/ambiente';
import { ServicioNotificaciones } from '../../services/notificaciones.service';

export const tabsDisponibles: Array<TabModel> = [
  {
    paginaDestino: CategoriasPage, // Inicio
    titulo: "inicio",
    icono: "custom-inicio",
    visible: false
  },
  {
    paginaDestino: AvisosPage, // Noticias
    titulo: "noticias",
    icono: "custom-noticias",
    visible: false
  },
  {
    paginaDestino: ComentariosPage, // Avisos
    titulo: "avisos",
    icono: "md-paper",
    visible: false
  },
  {
    paginaDestino: ListaPacientesPage, // Mi Cuenta
    titulo: "pacientes",
    icono: "md-medkit",
    visible: false
  },
  {
    paginaDestino: MapaHospitalesPage, // Mapa Hospitales
    titulo: "hospitales",
    icono: "md-medical",
    visible: false
  },
  {
    paginaDestino: MiCuentaPage, // Mi Cuenta
    titulo: "ajustes",
    icono: "md-cog",
    visible: false
  }
];

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public contadorTestNotificaciones: number = 0;

  // Nos avisará si estamos en ambiente de pruebas, saldrá si lo estamos, se ocultará si estamos en prod.
  public estamosEnPruebas: boolean;

  // Aquí se cargarán las tabs permitidas por cada usuario.
  public tabs: Array<TabModel>;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navParams: NavParams,
    public navController: NavController,
    private events: Events,
    private authenticationService: AuthenticationService,
    private app: App,
    private servicioUtilidades: ServicioUtilidades,
    private servicioNotificaciones: ServicioNotificaciones) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Los nombres tienen que ser IGUALES a los títulos de los tabs actuales.
  public obtenerPermisosPorTab(usuario: UsuarioModel): PermisosTabUsuarioModel {
    let permisosCiudadano: PermisosTabUsuarioModel = {
      defaultIndex: enum_tabs.ajustes,
      permisos: [
        "inicio",
        "noticias",
        "hospitales",
        "ajustes"
      ]
    }

    let permisosResponsable: PermisosTabUsuarioModel = {
      defaultIndex: enum_tabs.ajustes,
      permisos: [
        "hospitales",
        "pacientes",
        "avisos",
        "ajustes"
      ]
    }

    switch (usuario.descripcionTUsuario.toLowerCase()) {
      case "ciudadano": return permisosCiudadano;
      case "responsable": return permisosResponsable;
      default: return null;
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public activarTabsPorRol() {

    tabsDisponibles.forEach(tab => {
      tab.visible = false;
    });

    let usuario: UsuarioModel = this.authenticationService.getUserLocalStorage();
    let permisosTabUsuario: PermisosTabUsuarioModel = this.obtenerPermisosPorTab(usuario);
    if (permisosTabUsuario == null) {
      this.servicioUtilidades.alerta("Error", "No tiene permisos");
      this.authenticationService.logout(usuario);
      this.app.getRootNav().setRoot(LoginPage);
      return;
    }

    let tabs: Array<TabModel> = tabsDisponibles;
    for (let i = 0; i < tabs.length; i++) {
      if (permisosTabUsuario.permisos.indexOf(tabs[i].titulo) > -1) {
        tabs[i].visible = true;
      }
    }
    this.tabs = tabs.filter(tab => tab.visible == true);

    // Seleccionamos la tab preseleccionada si ha sido desde otra página.
    let nombreTab: string = this.navParams.get("nombreTab");
    if (nombreTab == null)
      return;
    let tabIndex: number = this.tabs.findIndex(tab => tab.titulo == nombreTab.toLowerCase());
    if (tabIndex == -1) {
      this.servicioUtilidades.alerta("Elemento no encontrado.", "");
      return;
    }
    const tabsNav = this.app.getNavByIdOrName('tabs') as Tabs;
    tabsNav.select(tabIndex);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidEnter() {

    this.activarTabsPorRol();
    setInterval(() => {
      // src\components\notificaciones\notificaciones.ts
      this.events.publish("actualizarNotificaciones");
    }, (30 * 1000));

    // src\services\inactividad.service.ts
    this.events.publish("iniciarDetectorInactividad");
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async testNotificacion() {
    if (PRODUCCION == false) {
      if (++this.contadorTestNotificaciones == 3) {
        this.contadorTestNotificaciones = 0;
        let usuario: UsuarioModel = this.authenticationService.getUserLocalStorage();
        if (usuario == null) {
          this.servicioUtilidades.toast("Error!, no hay usuario", "top");
          return;
        }
        if (usuario.token == null) {
          this.servicioUtilidades.toast("Error!, este usuario no tiene token de notificaciones", "top");
          return;
        }
        await this.servicioNotificaciones.probarNotificacion(usuario);
      }
    }
  }

}
