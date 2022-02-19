import { DocumentModel } from './../models/document.model';
import { modelEvidencia } from './../models/modelEvidencia';
import { Injectable } from "@angular/core";
import { ServicioWebPms } from './web-pms.servicio';

@Injectable()
export class StorageService {

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private servicioWebPms: ServicioWebPms
  ) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async uploadFiles(files: modelEvidencia[]): Promise<any> {
    let url = this.servicioWebPms.pathStorage + '/Storage/Guardar';
    return await this.servicioWebPms.postAsync(url, files);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async downloadFile(name: string): Promise<DocumentModel> {
    let url = this.servicioWebPms.pathStorage + '/Storage/ConsultaObjeto'
    return await this.servicioWebPms.postAsync(url, [{ "nombre": name }]);
  }



}