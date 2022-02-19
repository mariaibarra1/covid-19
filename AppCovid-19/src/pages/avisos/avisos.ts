import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchService } from '../../services/search.service';
import { InstanciaModel } from '../../models/instancia.model';
import { InstanciaService } from '../../services/instancia.service';
import { AvisoModel } from '../../models/aviso.model';
import { AvisoDetallePage } from './aviso-detalle/aviso-detalle';

@IonicPage()
@Component({
  selector: 'page-avisos',
  templateUrl: 'avisos.html',
})
export class AvisosPage {

  public lstAvisos: AvisoModel[][];
  public info: boolean = false;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private searchService: SearchService,
    public instService: InstanciaService, ) {
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async ionViewDidLoad() {
    this.obtenerAnunciosAsync();
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async obtenerAnunciosAsync() {
    let instancia: InstanciaModel;
    instancia = await this.instService.getInstanciaLocalStorage();
    var result = await this.searchService.searchAvisos(instancia.idInstancia);
    if (result == null) {
      this.info = true;
    } else { this.lstAvisos = result }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public irDetalle(aviso: AvisoModel) {
    this.navCtrl.push(AvisoDetallePage, { aviso: aviso });
  }
}
