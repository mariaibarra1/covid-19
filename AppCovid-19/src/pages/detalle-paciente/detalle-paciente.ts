import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PacienteModel } from '../../models/paciente.model';


@IonicPage()
@Component({
  selector: 'page-detalle-paciente',
  templateUrl: 'detalle-paciente.html',
})
export class DetallePacientePage {
  //#endregion
  detallePaciente:PacienteModel;
  icon:string;
  //#endregion
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.detallePaciente = navParams.get('detalle');

  }

  ionViewDidLoad() {

  }
  ionViewWillEnter(){
    this.icon='';
    this.getIcon(this.detallePaciente.nombreCaso);
  }

  public getIcon(nombre: string) {
    console.log('nombre del caso::' + nombre);
    switch (nombre.toUpperCase()) {
      case 'BAJO':
        this.icon = 'assets/icon/r_bajo.svg';
        break;
      case 'MODERADO':
        this.icon = 'assets/icon/r_moderado.svg';
        //this.editarUbicacion = true;
        break;
      case 'ALTO':
        this.icon = 'assets/icon/r_alto.svg';
        //this.editarUbicacion = true;
        break;
      case 'MUY ALTO':
        this.icon = 'assets/icon/r_muy_alto.svg';
        //this.editarUbicacion = true;
        break;
    }
    console.log('icono::::' + this.icon);
  }

}
