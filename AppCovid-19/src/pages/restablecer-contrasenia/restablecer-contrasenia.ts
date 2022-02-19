import { ServicioUtilidades } from './../../services/utilidades.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-restablecer-contrasenia',
  templateUrl: 'restablecer-contrasenia.html',
})
export class RestablecerContraseniaPage {

  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public nav: NavController,
    public authentication: AuthenticationService,
    private servicioUtilidades: ServicioUtilidades,
  ) {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(70),
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      Validators.required])]
    });
  }

  async resetPassword() {
    let validEmail = await this.authentication.resetPassword(this.myForm.value.email);
    if (validEmail) {
      this.servicioUtilidades.alerta('Éxito', 'Se envió un correo electrónico con su nueva contraseña');
      setTimeout(() => {
        this.nav.pop();
      }, 2000);
    } else {
      this.servicioUtilidades.alerta('Error', 'El correo no se encuentra registrado en el sistema');
    }
  }

}
