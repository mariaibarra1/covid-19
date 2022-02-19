
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMapsComponent } from '../../components/google-maps/google-maps';
import { ServicioDenue } from '../../services/denue.service';
import { SitioInegiModel } from '../../models/sitio-inegi.model';
import { Geolocation } from '@ionic-native/geolocation';
import { TicketsService } from '../../services/tickets.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { modelTickets } from '../../models/modelTickets';
import { CatalogosService } from '../../services/catalogos.service';
import { modelDependencias } from '../../models/modeldependencias';
import { ServicioUtilidades } from '../../services/utilidades.service';
import { PacienteModel } from '../../models/paciente.model';
declare var google: any;


@IonicPage()
@Component({
  selector: 'page-mapa-hospitales',
  templateUrl: 'mapa-hospitales.html',
})
export class MapaHospitalesPage {
  public lstStios: SitioInegiModel[] = [];
  public coordenadasZoom: Array<any> = [];
  public strLatLng = "";
  public strNombre = "";
  public strTelefono = "";
  public card: boolean = false;
  public usuario: UsuarioModel;
  public idhospitalXTicket: number;

  listaPacientes: PacienteModel[] = [];

  @ViewChild(GoogleMapsComponent) mapComponent: GoogleMapsComponent;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private servicioDenue: ServicioDenue,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private authenticationService: AuthenticationService,
    private servicioticket: TicketsService,
    private servicioCatalogos: CatalogosService,
    private servicioUtilidades: ServicioUtilidades,
  ) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewDidEnter() {

    let loading = this.servicioUtilidades.loading();
    loading.present();
    this.mapComponent.borrarMarcadores();
    try {
      await this.consultaHospitales();
    } catch (err) {

    }
    this.mapComponent.map.addListener('click', (event) => {
      this.card = null;
      // this.mapComponent.zoomArregloCoordenadasSitios(this.lstStios)
    });
    await this.obtenerHospitalTicket();
    await this.obtenerHospitalAsignado();
    await this.obtenerCatalohospitales();
    loading.dismiss();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public obtenerPromesaGeolocalizacion() {
    return new Promise<any>((resolve, reject) => {
      this.geolocation.getCurrentPosition().then(resp => {
        let miUbicacion = {
          direccion: "",
          coordenadas: {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude
          }
        }
        return resolve(miUbicacion);
      }).catch(err => {
        return resolve(null);
      });
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async crearMarcadorGeolocalizacion(geolocalizacion: any) {
    let marcador = this.mapComponent.crearMarcador(new google.maps.LatLng(geolocalizacion.lat, geolocalizacion.lng));
    this.mapComponent.agregarMarcador(marcador);
    this.mapComponent.dibujarMarcadores();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async consultaHospitales() {
    let geolocalizacion = await this.servicioUtilidades.obtenerPromesaGeolocalizacion();
    // this.mapComponent.zoomAPunto(geolocalizacion.coordenadas.lat, geolocalizacion.coordenadas.lng, .01);
    this.coordenadasZoom.push(geolocalizacion);
    this.crearMarcadorGeolocalizacion(geolocalizacion);
    let respuesta = await this.servicioDenue.obtenerSitiosAsync(geolocalizacion.lat, geolocalizacion.lng,
      "hospital%20general", 1000);

    if (respuesta == null)
      return;

    this.lstStios = respuesta;
    this.lstStios.forEach(a => { this.crearMarcadoresSitios(a) })
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public crearMarcadoresSitios(sitio: SitioInegiModel) {
    let icono = this.mapComponent.crearIconoMarcador("hospital", 25, 30);
    let marcador = this.mapComponent.crearMarcador(new google.maps.LatLng(+sitio.Latitud, +sitio.Longitud), icono, sitio);
    google.maps.event.addListener(marcador, 'click',
      (event) => {
        this.card = true;
        this.strNombre = sitio.Nombre;
        this.strTelefono = sitio.Telefono;
        this.strLatLng = "" + sitio.Latitud + "," + sitio.Longitud + "";
        this.mapComponent.zoomAPunto(+sitio.Latitud, +sitio.Longitud)

      });
    this.mapComponent.agregarMarcador(marcador);
    this.mapComponent.dibujarMarcadores();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerCatalohospitales() {
    let hospitales: modelDependencias[] = await this.servicioCatalogos.ConsultarTodasDependencias();

    hospitales.forEach(a => {
      if (this.idhospitalXTicket != a.idDependencia) {
        if (a.ubicacion.length > 3 && a.ubicacion.includes(':')) {
          let latlng = a.ubicacion.split(':');
          let icono = this.mapComponent.crearIconoMarcador("hospital", 25, 30);
          let marcador = this.mapComponent.crearMarcador(new google.maps.LatLng(+latlng[0], +latlng[1]), icono, null);
          google.maps.event.addListener(marcador, 'click',
            (event) => {
              this.card = true;
              this.strNombre = a.nombre;
              this.strTelefono = null
              this.strLatLng = "" + latlng[0] + "," + latlng[1] + "";
              this.mapComponent.zoomAPunto(+latlng[0], +latlng[1])

            });
          this.mapComponent.agregarMarcador(marcador);
          this.mapComponent.dibujarMarcadores();

        }
      }
    });

  }
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerHospitalAsignado() {
    let asociados = await this.servicioticket.obtenerPacientesAsociadosXResponsable(this.usuario.idUsuario);
    console.log(asociados);
    this.listaPacientes = asociados as PacienteModel[];
    if (this.listaPacientes.length == 0 || this.listaPacientes == null) {
      console.error('no tiene pacientes asociados');
      return;
    }
    if (this.listaPacientes[0].ubicacionHospital == null) {
      console.error('no tiene hospital asignado');
      return;
    }

    this.idhospitalXTicket = this.listaPacientes[0].idSubServicio;
    console.log(this.listaPacientes[0].idSubServicio)


    let latlng = this.listaPacientes[0].ubicacionHospital.split(':')
    let icono = this.mapComponent.crearIconoMarcador("hospital2", 40, 40);
    let marcador = this.mapComponent.crearMarcador(new google.maps.LatLng(latlng[0], latlng[1]), icono);
    this.coordenadasZoom.push({ lat: latlng[0], lng: latlng[1] });
    this.mapComponent.zoomArregloCoordenadas(this.coordenadasZoom);
    google.maps.event.addListener(marcador, 'click',
      (event) => {
        this.card = true;
        this.strNombre = '(ASIGNADO)' + this.listaPacientes[0].descripcionHospital;
        this.strTelefono = null
        this.strLatLng = "" + latlng[0] + "," + latlng[1] + "";
      });
    this.mapComponent.agregarMarcador(marcador);
    console.log('agregando marcador');
    console.log(marcador);
    this.mapComponent.dibujarMarcadores();

  }
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerHospitalTicket() {
    this.usuario = this.authenticationService.getUserLocalStorage();
    let ticket = await this.servicioticket.obtenerTicketActualUsuario(this.usuario.idUsuario);
    if (ticket == null)
      return;
    let ticketUsuario = new modelTickets;
    ticketUsuario.idTicket = ticket.idTicket;
    let arrTicketsData: Array<modelTickets> = await this.servicioticket.getTicket(ticketUsuario);
    if (arrTicketsData == null || arrTicketsData.length == 0) {
      console.error("ticketsData vacio o length 0");
      return
    }

    let arrDependeciasXTicket: Array<modelDependencias> = await this.servicioCatalogos.ConsultarDependencia(null);
    let dependeciaXTicket: modelDependencias = arrDependeciasXTicket.find(dep => dep.idDependencia == arrTicketsData[0].idSubServicio);

    if (dependeciaXTicket == null)
      return;

    this.idhospitalXTicket = dependeciaXTicket.idDependencia;
    if (dependeciaXTicket.ubicacion.length > 3 && dependeciaXTicket.ubicacion.includes(':')) {
      let latlng = dependeciaXTicket.ubicacion.split(':')
      let icono = this.mapComponent.crearIconoMarcador("hospital2", 40, 40);
      let marcador = this.mapComponent.crearMarcador(new google.maps.LatLng(latlng[0], latlng[1]), icono);
      this.coordenadasZoom.push({ lat: latlng[0], lng: latlng[1] });
      this.mapComponent.zoomArregloCoordenadas(this.coordenadasZoom);
      google.maps.event.addListener(marcador, 'click',
        (event) => {
          this.card = true;
          this.strNombre = dependeciaXTicket.nombre;
          this.strTelefono = null
          this.strLatLng = "" + latlng[0] + "," + latlng[1] + "";
        });
      this.mapComponent.agregarMarcador(marcador);
      this.mapComponent.dibujarMarcadores();
    }

  }

}