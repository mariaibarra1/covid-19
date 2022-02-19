import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestablecerContraseniaPage } from '../restablecer-contrasenia/restablecer-contrasenia';
import { AuthenticationService } from '../../services/authentication.service';
import { TabsPage } from '../tabs/tabs';
import { BannerService } from '../../services/banner.service';
import { InstanciaService } from '../../services/instancia.service';
import { ServicioNotificaciones } from '../../services/notificaciones.service';
import { UsuarioModel } from '../../models/usuario.model';
import { TicketsService } from '../../services/tickets.service';
import { CatalogosService } from '../../services/catalogos.service';
import { TicketsPage } from '../tickets/tickets';
import { PaginaDestino } from '../../models/pagina-destino-model';
import { ServicioUtilidades } from '../../services/utilidades.service';
import { PrimerEncuestaPage } from '../primer-encuesta/primer-encuesta';
import { PRODUCCION } from '../../app/ambiente';
import { InstanciaModel } from '../../models/instancia.model';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public myForm: FormGroup;
  public mensajeError: string;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    private bannerService: BannerService,
    private instanceService: InstanciaService,
    private servicioNotificaciones: ServicioNotificaciones,
    private ticketsService: TicketsService,
    private catalogosService: CatalogosService,
    private servicioUtilidades: ServicioUtilidades,
  ) {
    this.myForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
        Validators.required])],
      password: ['', Validators.required]
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewWillEnter() {
    await this.loadBanners();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async loadBanners() {
    let instancia = await this.instanceService.getInstanciaLocalStorage();
    await this.bannerService.ProcesosBanner(instancia.idInstancia);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerUsuarioAsync(): Promise<UsuarioModel> {
    await this.authService.login(this.servicioUtilidades.limpiarCorreoElectronico(this.myForm.value.email),
      this.myForm.value.password);
    if (this.authService.isAuthenticated() == false) {
      return null;
    }

    let respuesta: any = (await this.authService.getUserByEmail(this.servicioUtilidades.limpiarCorreoElectronico(this.myForm.value.email)));
    if (respuesta == null || respuesta.length == 0) {
      return null;
    }

    let usuario: UsuarioModel = respuesta[0];
    if (usuario.descripcionTUsuario.toLowerCase() != 'ciudadano' && usuario.descripcionTUsuario.toLowerCase() != 'responsable') {
      return null;
    }

    return usuario;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async login() {
    this.mensajeError = null;
    let loading = this.loadingCtrl.create({
      content: "Espere un momento por favor..."
    });
    loading.present();

    let usuario: UsuarioModel = await this.obtenerUsuarioAsync();
    if (usuario == null) {
      loading.dismiss();
      this.mensajeError = "Usuario o contraseña incorrectos";
      return;
    }

    // Ya que sabemos que es un usuario válido, validaremos que tenga los registros necesarios.
    loading.setContent("Obteniendo el seguimiento de su caso...");
    let paginaDestino: PaginaDestino = null;
    if (usuario.descripcionTUsuario == "ciudadano") {
      paginaDestino = await this.obtenerPaginaDestinoCiudadanoAsync(usuario);
    } else if (usuario.descripcionTUsuario == "responsable") {
      paginaDestino = await this.obtenerPaginaDestinoReponsableAsync(usuario);
    }

    if (paginaDestino == null) {
      loading.dismiss();
      this.mensajeError = "Ocurrió un error con los datos de su cuenta, favor de contactar al administrador.";
      return;
    }

    // Guardamos los datos del usuario en local storage una vez hayan pasado todas las validaciones.
    usuario = await this.servicioNotificaciones.guardarTokenNotificacionEnUsuario(usuario);
    this.authService.setUserData(usuario);

    this.navCtrl.setRoot(paginaDestino.pagina, paginaDestino.params)
    loading.dismiss();
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

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public restablecerContrasenia() {
    this.navCtrl.push(RestablecerContraseniaPage);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public primerEncuesta() {
    this.navCtrl.push(PrimerEncuestaPage);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async hackLocalizacion() {
    if (PRODUCCION == false) {
      let instancias = await this.instanceService.getInstanciasAsync();
      let instancia: InstanciaModel = instancias.find(ints => ints.nombreCorto.toLowerCase() == "cdmx");
      if (instancia == null) {
        this.servicioUtilidades.toast("¡ERROR! no hay registro en la bd que concuerde con 'CDMX', no fue posible forzar ubicación", "top");
        return;
      }
      this.instanceService.setInstanciaLocalStorage(instancia);
      this.servicioUtilidades.toast("¡Hack! Instancia CDMX", "top");
      this.navCtrl.setRoot(LoginPage);
    }
  }

}
