import { CuidatePage } from './../cuidate/cuidate';
import { InstanciaService } from './../../services/instancia.service';
import { CatalogosService } from './../../services/catalogos.service';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthenticationService } from '../../services/authentication.service';
import { ServicioNotificaciones } from '../../services/notificaciones.service';
import { TabsPage } from '../tabs/tabs';
import { TicketsPage } from '../tickets/tickets';
import { TicketsService } from '../../services/tickets.service';
import { ServicioUtilidades } from '../../services/utilidades.service';
import { LoginPage } from '../login/login';
import { CoordenadaModel } from '../../models/coordenada.model';
import { InstanciaModel } from '../../models/instancia.model';
import { UsuarioModel } from '../../models/usuario.model';
import { PaginaDestino } from '../../models/pagina-destino-model';
import { PRODUCCION } from '../../app/ambiente';

@IonicPage()
@Component({
  selector: 'page-instancia',
  templateUrl: 'instancia.html',
})
export class InstanciaPage {

  public contenidoCargado: boolean = false;
  public mensaje: string = "";
  public geolocalizacion: CoordenadaModel;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    private instService: InstanciaService,
    private authService: AuthenticationService,
    private servicioNotificaciones: ServicioNotificaciones,
    private ticketsService: TicketsService,
    private catalogosService: CatalogosService,
    private servicioUtilidades: ServicioUtilidades,
  ) {

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewDidEnter() {
    await this.verificarSesion();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async hackLocalizacion() {
    if (PRODUCCION == false) {
      let instancias = await this.instService.getInstanciasAsync();
      let instancia: InstanciaModel = instancias.find(ints => ints.nombreCorto.toLowerCase() == "cdmx");
      if (instancia == null) {
        this.servicioUtilidades.toast("¡ERROR! no hay registro en la bd que concuerde con 'CDMX', no fue posible forzar ubicación", "top");
        return;
      }
      this.instService.setInstanciaLocalStorage(instancia);
      this.servicioUtilidades.toast("¡Hack! Instancia CDMX", "top");
      this.navCtrl.setRoot(LoginPage);
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Validará si el usuario está dentro del área de alguno de los clientes, si no está alv no puede usar la app.
  public async obtenerInstanciaConPermisoUbicacion(): Promise<InstanciaModel> {
    let geolocalizacion: CoordenadaModel = await this.servicioUtilidades.obtenerPromesaGeolocalizacion();
    this.geolocalizacion = geolocalizacion;
    if (geolocalizacion == null) {
      return null;
    }

    let instancias = await this.instService.getInstanciasAsync();
    if (!instancias)
      return null;

    for (let i = 0; i < instancias.length; i++) {
      if (this.servicioUtilidades.esJson(instancias[i].poligono_json) == false)
        continue;

      let poligono: Array<CoordenadaModel> = JSON.parse(instancias[i].poligono_json);
      if (this.servicioUtilidades.coordenadaDentroPoligono(geolocalizacion, poligono))
        return instancias[i];
    }

    return null;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async verificarSesion() {

    let instancia: InstanciaModel = this.instService.getInstanciaLocalStorage();
    if (instancia == null) {
      instancia = await this.obtenerInstanciaConPermisoUbicacion();
      if (instancia == null) {
        this.mensaje = "No se encuentra en un lugar permitido para usar la aplicación.";
        this.contenidoCargado = true;
        return;
      }
    }

    // Guardamos la instancia localmente.
    this.instService.setInstanciaLocalStorage(instancia);
    this.servicioUtilidades.toast("Ubicación: " + this.servicioUtilidades.capitalizar(instancia.nombreCorto));

    let usuario: UsuarioModel = this.authService.getUserLocalStorage();
    if (usuario == null) {
      this.navCtrl.setRoot(CuidatePage);
      return;
    }

    let paginaDestino: PaginaDestino = null;
    if (usuario.descripcionTUsuario == "ciudadano") {
      paginaDestino = await this.obtenerPaginaDestinoCiudadanoAsync(usuario);
    } else if (usuario.descripcionTUsuario == "responsable") {
      paginaDestino = await this.obtenerPaginaDestinoReponsableAsync(usuario);
    }

    if (paginaDestino == null) {
      this.authService.logout(usuario);
      paginaDestino = {
        pagina: LoginPage,
        params: null
      }
    } else {
      // Guardamos los datos del usuario en local storage una vez hayan pasado todas las validaciones.
      usuario = await this.servicioNotificaciones.guardarTokenNotificacionEnUsuario(usuario);
      this.authService.setUserData(usuario);
    }

    this.navCtrl.setRoot(paginaDestino.pagina, paginaDestino.params);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Regresa la página a la que será redirigido el usuario al iniciar sesión
  public async obtenerPaginaDestinoCiudadanoAsync(usuario: UsuarioModel): Promise<PaginaDestino> {
    // Ticket actual del ciudadano.
    let ticketActual = await this.ticketsService.obtenerTicketActualUsuario(usuario.idUsuario);
    if (ticketActual == null) {
      console.error("Ciudadano sin ticket.")
      return null;
    }

    let encuestas = await this.catalogosService.getEncuestaXTicket(ticketActual.idTicket);
    if (encuestas == null || encuestas.length == 0) {
      return <PaginaDestino>{ pagina: TicketsPage, params: { idTicket: ticketActual.idTicket } };
    } else {
      return <PaginaDestino>{ pagina: TabsPage, params: null };
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Regresa la página a la que será redirigido el usuario al iniciar sesión
  public async obtenerPaginaDestinoReponsableAsync(usuario: UsuarioModel): Promise<PaginaDestino> {
    // Ticket actual del responsable.
    let ticketActual = await this.ticketsService.obtenerTicketActualResponsable(usuario.idUsuario);
    if (ticketActual == null) {
      console.error("Responsable sin ticket.")
      return null;
    }
    let paginaDestino: PaginaDestino = {
      pagina: TabsPage,
      params: null
    }
    return paginaDestino;
  }

}
