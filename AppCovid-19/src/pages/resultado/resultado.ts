import { Component, ElementRef, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { CatalogosService } from '../../services/catalogos.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { InstanciaModel } from '../../models/instancia.model';
import { InstanciaService } from '../../services/instancia.service';
import { modelCasosTicket } from '../../models/modelCasosTicket';
import { TicketsService } from '../../services/tickets.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import * as Constants from '../../utilities/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResultadoSeguimientoPage } from '../resultado-seguimiento/resultado-seguimiento';
import { enum_tabs } from '../../utilities/constants';
import { ServicioUtilidades } from '../../services/utilidades.service';

@IonicPage()
@Component({
  selector: 'page-resultado',
  templateUrl: 'resultado.html',
})
export class ResultadoPage {
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
  public geoCoder;
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

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private CatalogosService: CatalogosService,
    private authService: AuthenticationService,
    private instService: InstanciaService,
    private servicioUtilidades: ServicioUtilidades,
    private tickectService: TicketsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    private app: App

  ) {
    this.sumaEncuesta = this.navParams.get('sumaEncuesta');
    this.folioTicket = this.navParams.get('folioTicket') ? this.navParams.get('folioTicket') : '';

    console.log('suma de la encuesta:::' + this.sumaEncuesta);
    this.ticketsForm = formBuilder.group({
      ubicacion: [],
      numeroTelefonico: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8)]],
      calle: [''],
      numeroExterior: [''],
      colonia: [''],
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ionViewDidLoad() {
    console.log('ionViewDidLoad ResultadoPage');
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async ionViewWillEnter() {
    this.editarUbicacion = false;
    await this.getuserData();

    // if (this.sumaEncuesta) {
    //   if (this.sumaEncuesta > 0) {
    //     this.getFirstTicketUsr();
    //   } else {
    //     await this.getuserData();
    //   }
    // } else {
    //   await this.getuserData();
    // }

    this.contenidoCargado = true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public regresar() {
    this.app.getRootNav().setRoot(TabsPage, { tabIndex: enum_tabs.inicio });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getFirstTicketUsr() {
    let user = this.authService.getUserLocalStorage();
    if (user) {
      this.LoggedUser = user;
    } else {
      this.LoggedUser.idUsuario = 0;
      this.LoggedUser.nombre = '';
    }
    console.log('el id del usuario es:::' + this.LoggedUser.idUsuario);
    let ListTicket = await this.tickectService.getAllTickets(this.LoggedUser.idUsuario);
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
          await this.obtenerResultado(this.sumaEncuesta);
          console.log('puede editar su ubicacion?:::::' + this.editarUbicacion);
          if (this.editarUbicacion) {
            await this.getUbicacionTicket(ListTicket[0].ubicacion);
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
  public async getAllTicketsUsr() {
    console.log('el id del usuario es:::' + this.LoggedUser.idUsuario);
    let ListTicket = await this.tickectService.getAllTickets(this.LoggedUser.idUsuario);
    console.log('tickets del usuario');
    console.log(ListTicket);
    if (ListTicket) {
      if (ListTicket.length > 0) {
        if (ListTicket[0].idTicket) {
          console.log(ListTicket[0].idTicket);

          this.Encuestas = await this.CatalogosService.getEncuestaXTicket(ListTicket[0].idTicket);
          console.log('encuestas');
          console.log(this.Encuestas);
          if (this.folioTicket == '') {
            this.folioTicket = ListTicket[0].folio;
            console.log('folio:::::' + this.folioTicket);
          }
          if (this.Encuestas) {
            if (this.Encuestas.length > 0) {
              await this.verificarEncuesta(this.Encuestas);
              console.log('puede editar su ubicacion?:::::' + this.editarUbicacion);
              if (this.editarUbicacion) {
                await this.getUbicacionTicket(ListTicket[0].ubicacion);
              }
            } else {
              this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
            }
          } else {
            this.servicioUtilidades.alerta('Error', 'No cuenta con encuestas registradas');
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
  public async verificarEncuesta(encuesta) {
    let suma = 0;
    for (let i = 0; i < encuesta.length; i++) {
      suma += + encuesta[i].ponderacion;
    }
    console.log('suma de la encuesta:::::' + suma);
    await this.obtenerResultado(suma);
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
  public async getuserData() {
    let user = this.authService.getUserLocalStorage();
    if (user) {
      this.LoggedUser = user;
    } else {
      this.LoggedUser.idUsuario = 0;
      this.LoggedUser.nombre = '';
    }
    await this.getAllTicketsUsr();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async getCasos(idCaso) {
    console.log('id del caso:::' + idCaso);
    let instancia: InstanciaModel;
    instancia = await this.instService.getInstanciaLocalStorage();
    this.CasosTicket = await this.CatalogosService.ConsultaTiposAtencion(instancia.idInstancia);
    //this.CasosTicket.find(x=>x.idCaso==idCaso);
    if (this.CasosTicket.find(x => x.idCaso == idCaso)) {
      console.log('encontrado el caso');
      if (this.CasosTicket.find(x => x.idCaso == idCaso).nombre) {
        //console.log('no trae nombre');
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
        break;
      case 'ALTO':
        this.icon = 'assets/icon/r_alto.svg';
        break;
      case 'MUY ALTO':
        this.icon = 'assets/icon/r_muy_alto.svg';
        break;
    }
    this.editarUbicacion = false;
    console.log('icono::::' + this.icon);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getUbicacionTicket(ubicacion) {
    this.mapsAPILoader.load().then(() => {
      //this.serviceAutoComplete = new google.maps.places.AutocompleteService();  
      //this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let location: string[] = ubicacion.split(':');
      if (location) {
        this.latitude = +location[0];
        this.longitude = +location[1];
        this.zoom = Constants.zoomMap;
        this.getAddress(this.latitude, this.longitude);
      }
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
  async submitDatosUsuario(formData) {
    let usuario: UsuarioModel;
    usuario = new UsuarioModel();
    usuario.telefono = formData.numeroTelefonico;
    usuario.calle = formData.calle;
    usuario.numero = +formData.numeroExterior;
    usuario.municipio = formData.colonia;
    usuario.idUsuario = this.LoggedUser.idUsuario;
    usuario.email = this.LoggedUser.email;
    //debugger;
    let response = await this.authService.editUser(usuario);
    console.log(response);
    if (response) {
      if (response == 1) {
        this.servicioUtilidades.alerta('Exito', 'Sus datos se actualizaron correctamente');
        this.navCtrl.setRoot(ResultadoSeguimientoPage, { folio: this.folioTicket, caso: this.nombreCaso });
      } else {
        this.servicioUtilidades.alerta('Error', 'No se guardaron sus cambios, intente nuevamente');
      }
    } else {
      this.servicioUtilidades.alerta('Error', 'Ocurrió un error al guardar los cambios');
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
