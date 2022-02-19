import { Component, ElementRef, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App } from 'ionic-angular';
import { CatalogosService } from '../../services/catalogos.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { InstanciaModel } from '../../models/instancia.model';
import { InstanciaService } from '../../services/instancia.service';
import { modelCasosTicket } from '../../models/modelCasosTicket';
import { StorageService } from '../../services/storage.service';
import { TicketsService } from '../../services/tickets.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import * as Constants from '../../utilities/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResultadoSeguimientoPage } from '../resultado-seguimiento/resultado-seguimiento';
import { enum_tabs } from '../../utilities/constants';
import { CuidatePage } from '../cuidate/cuidate';
import { ServicioUtilidades } from '../../services/utilidades.service';
import { UsuarioRegistroModel } from '../../models/usuario-registro.model';
import { ServicioNotificaciones } from '../../services/notificaciones.service';
import { EncuestaSubmit } from '../../models/encuestaSubmit.model';

@IonicPage()
@Component({
  selector: 'page-primer-resultado',
  templateUrl: 'primer-resultado.html',
})
export class PrimerResultadoPage {
  @ViewChild('search')

  public avisos = [];
  public LoggedUser = new UsuarioModel;
  public sumaEncuesta = 0;
  public CasosTicket: modelCasosTicket[];
  public Encuestas = [];
  public icon: string;
  public contenidoCargado: boolean = false;
  public editarUbicacion: boolean = false;
  public latitudMap: number;
  public longitudMap: number;
  public zoomMap: number;
  public serviceAutoComplete: any;
  private geoCoder;
  public searchElementRef: ElementRef;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  public address: string;
  public entidad: string;
  public municipio: string;
  public colonia: string;
  public numeroExterior: string;
  public calle: string;
  public numeroTelefonico: string = '';
  public autocompleteItems;
  public autocomplete;
  public ticketsForm: FormGroup;
  public searchTerm: string = '';
  public nombreCaso: string = '';
  public folioTicket: string = '';
  public idInstancia: number;
  public mensajeCorreoValidacion = "";
  public infoPass: boolean;
  public idEncuestaNav: number = 0;
  public generos: Array<{ id: number, valor: any }>;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private CatalogosService: CatalogosService,
    public authService: AuthenticationService,
    public instService: InstanciaService,
    public storage: StorageService,
    public tickectService: TicketsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    public platform: Platform,
    public formBuilder: FormBuilder,
    private app: App,
    public servicioUtilidades: ServicioUtilidades,
    private servicioNotificaciones: ServicioNotificaciones,

  ) {
    this.sumaEncuesta = this.navParams.get('sumaEncuesta');

    console.log('suma de la encuesta:::' + this.sumaEncuesta);
    this.ticketsForm = formBuilder.group({
      ubicacion: [],
      numeroTelefonico: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8)]],
      calle: [''],
      numeroExterior: [''],
      colonia: [''],
      email: ['', Validators.compose([Validators.maxLength(70),
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(15), Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#,:;?¿=_¡+-.\$%\^&\*])(?=.{8,})/),
      Validators.required])],
      passwordConfirm: ['', Validators.required],
      nombre: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      fechaNacimiento: ['', Validators.compose([Validators.maxLength(20)])],
      cpostal: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(5)])],
      genero: ['', Validators.required]
    });
    this.ticketsForm.statusChanges.subscribe(
      result => {
        console.log(result);
        this.findInvalidControls();
      }
    );
    this.generos = [
      { id: 1, valor: "Masculino" },
      { id: 2, valor: "Femenino" },
      { id: 3, valor: "Otro" }
    ];
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLoad() {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewWillEnter() {
    await this.intanceData();
    await this.getFirstTicketUsr();
    this.contenidoCargado = true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async intanceData() {
    let instancia: InstanciaModel;
    instancia = await this.instService.getInstanciaLocalStorage();
    this.idInstancia = instancia.idInstancia;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public showInfoPass(ban) {
    this.infoPass = ban;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public findInvalidControls() {
    const invalid = [];
    const controls = this.ticketsForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public regresar() {
    this.app.getRootNav().setRoot(CuidatePage, { tabIndex: enum_tabs.inicio });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getFirstTicketUsr() {
    await this.obtenerResultado(this.sumaEncuesta);
    await this.getUbicacionTicket();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerResultado(suma) {
    this.avisos = await this.CatalogosService.getResultadoPorSuma(suma);
    console.log(this.avisos);
    console.log(this.avisos[0]);
    if (this.avisos[0]) {
      if (this.avisos[0][0]) {
        if (this.avisos[0][0].idCaso) {
          await this.getCasos(this.avisos[0][0].idCaso);
        } else {
          this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los resultados de la encuesta');
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los resultados de la encuesta');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al obtener los resultados de la encuesta');
    }
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getCasos(idCaso) {
    console.log('id del caso:::' + idCaso);
    let instancia: InstanciaModel;
    instancia = await this.instService.getInstanciaLocalStorage();
    this.idEncuestaNav = instancia.idEncuesta;
    this.CasosTicket = await this.CatalogosService.ConsultaTiposAtencion(instancia.idInstancia);
    if (this.CasosTicket.find(x => x.idCaso == idCaso)) {
      console.log('encontrado el caso');
      if (this.CasosTicket.find(x => x.idCaso == idCaso).nombre) {
        this.nombreCaso = this.CasosTicket.find(x => x.idCaso == idCaso).nombre;
        this.getIcon(this.CasosTicket.find(x => x.idCaso == idCaso).nombre)
      }
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getIcon(nombre: string) {
    console.log('nombre del caso::' + nombre);
    switch (nombre.toUpperCase()) {
      case 'BAJO':
        this.icon = 'assets/icon/r_bajo.svg';
        break;
      case 'MODERADO':
        this.icon = 'assets/icon/r_moderado.svg';
        this.editarUbicacion = true;
        break;
      case 'ALTO':
        this.icon = 'assets/icon/r_alto.svg';
        this.editarUbicacion = true;
        break;
      case 'MUY ALTO':
        this.icon = 'assets/icon/r_muy_alto.svg';
        this.editarUbicacion = true;
        break;
    }
    console.log('icono::::' + this.icon);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private getUbicacionTicket() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

    });

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public setCurrentAddress() {
    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 30000
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = Constants.zoomMap;
        this.getAddress(this.latitude, this.longitude);
      }, (error) => {
        console.log(error);
      }, options);

    } else {
      console.log('no');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async submitDatosUsuario(formData) {
    console.log(formData);

    let usuario: UsuarioRegistroModel;
    usuario = new UsuarioRegistroModel();
    usuario.nombre = formData.nombre;
    usuario.email = formData.email;
    usuario.codigoPostal = formData.cpostal;
    usuario.fechaNacimiento = formData.fechaNacimiento;
    usuario.password = formData.password;
    usuario.instancia = this.idInstancia;
    usuario.ubicacion = this.latitude + ':' + this.longitude;
    usuario.Telefono = formData.numeroTelefonico;
    usuario.Calle = formData.calle;
    usuario.Numero = formData.numeroExterior;
    usuario.Municipio = formData.colonia;
    usuario.idGenero = formData.genero;
    let response = await this.authService.createUserTicket(usuario);
    console.log(response);
    if (response) {
      if (response.idTicket) {
        let TicketID = response.idTicket;
        this.servicioUtilidades.alerta('Éxito', 'Te has registrado correctamente');
        this.authService.setAutenticated();

        if (this.authService.isAuthenticated()) {
          let usuario = await this.authService.getUserByEmail(formData.email);
          this.authService.setUserData(usuario[0]);
          await this.servicioNotificaciones.guardarTokenNotificacionEnUsuario(usuario[0]);
          await this.getFolioTicket(usuario[0].idUsuario);
          let encuestaGuardada = await this.sendEncuesta(TicketID);
          if (encuestaGuardada) {
            this.navCtrl.setRoot(ResultadoSeguimientoPage, { folio: this.folioTicket, caso: this.nombreCaso });
          } else {
            this.servicioUtilidades.alerta('Error', 'No se guardo sus resultados de la encuesta, intente nuevamente');
          }
        } else {
          this.mensajeCorreoValidacion = "Ocurrió un error al obtener los datos del usuario, favor de verificar los datos ingresados."
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'No se guardaron sus cambios, intente nuevamente');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al guardar los cambios');
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getFolioTicket(idUsuario) {
    let ListTicket = await this.tickectService.getAllTickets(idUsuario);
    console.log('tickets del usuario');
    console.log(ListTicket);
    if (ListTicket) {
      if (ListTicket.length > 0) {
        if (ListTicket[0].idTicket) {
          console.log(ListTicket[0].idTicket);
          if (this.folioTicket == '') {
            this.folioTicket = ListTicket[0].folio;
            console.log('folio:::::' + this.folioTicket);
          }
        }
      } else {
        this.servicioUtilidades.alerta('Error', 'No cuenta con tickets registrados, no tiene una encuesta asignada');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'No cuenta con tickets registrados, no tiene una encuesta asignada');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async sendEncuesta(ticket) {
    let encuestasMandar: EncuestaSubmit[];
    encuestasMandar = [];
    let encuestasLS = JSON.parse(localStorage.getItem('encuesta_respondida'));
    console.log('encuestas en local storage');
    console.log(encuestasLS);
    if (encuestasLS) {
      for (let i = 0; i < encuestasLS.length; i++) {
        let q = new EncuestaSubmit({});
        q.idPregunta = +encuestasLS[i].idPregunta;
        q.idRespuesta = +encuestasLS[i].idRespuesta;
        q.idTicket = +ticket;
        q.idEncuesta = +this.idEncuestaNav;
        q.IdUsuario = 0;
        q.ponderacion = +encuestasLS[i].idRespuesta;
        q.Resultado = +encuestasLS[i].Resultado;
        q.IdResultEncuesta = null;
        encuestasMandar.push(q);
      }
      console.log('array para mandar a guardar');
      console.log(encuestasMandar);
      let resp = await this.CatalogosService.postEncuesta(encuestasMandar);
      console.log(resp);
      if (resp == 0) {
        return true
      } else {
        this.servicioUtilidades.alerta('Error', 'Ocurrió un error al guardar las respuestas de la encuesta');
        return false;
      }
    } else {
      return false;
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.serviceAutoComplete = new google.maps.places.AutocompleteService();
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private setCurrentLocation() {
    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 30000
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = Constants.zoomMap;
        this.getAddress(this.latitude, this.longitude);
      }, (error) => {
        console.log(error);
      }, options);

    } else {
      console.log('no');
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = Constants.zoomMap;
          this.address = results[0].formatted_address;
          results.forEach(result => {
            console.log(result);
            if (result.types[0] == 'street_address') {
              this.numeroExterior = result.address_components[0].long_name;
              this.calle = result.address_components[1].long_name;
              this.colonia = result.address_components[2].long_name;
            }
            console.log('direccion:::' + this.address);
            console.log('colonia::::' + this.colonia);
            console.log('entidad::::' + this.entidad);
            console.log('numero:::::' + this.numeroExterior);
            console.log('calle:::::' + this.calle);
          });
          this.changeDetectorRef.detectChanges();
        } else {
          window.alert('Sin resultados');
        }
      } else {
        window.alert('Error al cargar el mapa: ' + status);
      }
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    this.serviceAutoComplete.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: {
        country: 'mx'
      }
    }, (predictions, status) => {
      this.autocompleteItems = [];
      this.ngZone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public chooseLocation(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      this.getAddress(this.latitude, this.longitude);
    });
    this.autocompleteItems = [];
  }
}
