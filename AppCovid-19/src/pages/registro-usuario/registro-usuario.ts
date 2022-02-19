import { InstanciaService } from './../../services/instancia.service';
import { AuthenticationService } from './../../services/authentication.service';
import { UsuarioModel } from '../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstanciaModel } from '../../models/instancia.model';
import { UsuarioRegistroModel } from '../../models/usuario-registro.model';
import { ServicioNotificaciones } from '../../services/notificaciones.service';
import { TicketsPage } from '../tickets/tickets';
import { ServicioUtilidades } from '../../services/utilidades.service';

@IonicPage()
@Component({
  selector: 'page-registro-usuario',
  templateUrl: 'registro-usuario.html',
})

export class RegistroUsuarioPage implements OnInit {

  myForm: FormGroup;
  loading: Loading;
  userModel: UsuarioModel;
  items: any = [];
  generos: Array<{ id: number, valor: any }>;
  infoPass: boolean;
  idInstancia: number;
  validacion = false;
  public mensajeCorreoValidacion = "";

  constructor(
    public nav: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public authentication: AuthenticationService,
    public instService: InstanciaService,
    private servicioNotificaciones: ServicioNotificaciones,
    public servicioUtilidades: ServicioUtilidades
  ) {
    this.myForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(70),
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(15), Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#,:;?¿=_¡+-.\$%\^&\*])(?=.{8,})/),
      Validators.required])],
      passwordConfirm: ['', Validators.required],
      nombre: ['', Validators.compose([Validators.maxLength(50)])],
      fechaNacimiento: ['', Validators.compose([Validators.maxLength(20)])],
      cpostal: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(5)])],
      genero: ['', Validators.required]
    });

    this.items = [
      { nombre: false },
      { personales: false },
      { correo: false }
    ];

    this.generos = [
      { id: 1, valor: "Masculino" },
      { id: 2, valor: "Femenino" },
      { id: 3, valor: "Otro" }
    ];
    this.myForm.statusChanges.subscribe(
      result => {
        console.log(result);
        this.findInvalidControls();
      }
    );
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ngOnInit(): void {
    this.intanceData();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public findInvalidControls() {
    const invalid = [];
    const controls = this.myForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async intanceData() {
    let instancia: InstanciaModel;
    instancia = await this.instService.getInstanciaLocalStorage();
    this.idInstancia = instancia.idInstancia;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async registerUser(formData) {
    let loading = this.servicioUtilidades.loading();
    loading;
    if (this.myForm.value.password == this.myForm.value.passwordConfirm) {
      this.myForm.value.email = this.servicioUtilidades.limpiarCorreoElectronico(this.myForm.value.email);
      this.mensajeCorreoValidacion = "";
      var model = new UsuarioRegistroModel;
      model.nombre = formData.nombre;
      model.email = formData.email;
      model.password = formData.password;
      model.instancia = this.idInstancia;// 1;
      model.codigoPostal = +formData.cpostal;
      model.idGenero = formData.genero;
      model.fechaNacimiento = formData.fechaNacimiento;
      let geolocalizacion = await this.servicioUtilidades.obtenerPromesaGeolocalizacion();
      console.log(geolocalizacion);
      model.ubicacion = null;
      if (geolocalizacion) {
        if (geolocalizacion) {
          if (geolocalizacion.lat && geolocalizacion.lng) {
            model.ubicacion = geolocalizacion.lat + ':' + geolocalizacion.lng;
          }
        }
      }
      console.log(model);
      console.log(JSON.stringify(model));
      let userStatus = await this.authentication.createUserTicket(model);
      if (userStatus) {
        if (userStatus.idEncuesta && userStatus.idTicket) {
          let idEncuesta = userStatus.idEncuesta;
          let idTicket = userStatus.idTicket;
          console.log('encuesta:::' + idEncuesta + '::::ticket' + idTicket);
          this.servicioUtilidades.alerta('Éxito', 'Te has registrado correctamente');
          this.authentication.setAutenticated();
          if (this.authentication.isAuthenticated()) {
            let usuario = await this.authentication.getUserByEmail(formData.email);
            let user = await this.servicioNotificaciones.guardarTokenNotificacionEnUsuario(usuario[0]);
            this.authentication.setUserData(user);
            this.nav.setRoot(TicketsPage, { autenticado: true, firstTicket: true, idEncuesta: idEncuesta, idTicket: idTicket });
          } else {
            this.mensajeCorreoValidacion = "Ocurrió un error al obtener los datos del usuario, favor de verificar los datos ingresados."
          }
        } else {
          this.mensajeCorreoValidacion = "Este correo ya está registrado.";
        }
      } else {
        this.mensajeCorreoValidacion = "Este correo ya está registrado.";
      }
    }
    loading.dismiss();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  expandItem(item): void {

    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  showInfoPass(ban) {
    this.infoPass = ban;
  }
}
