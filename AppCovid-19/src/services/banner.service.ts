import { modelBanners } from './../models/modelBanners';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ServicioWebPms } from './web-pms.servicio';

@Injectable()
export class BannerService {

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private storageService: StorageService,
    private servicioWebPms: ServicioWebPms
  ) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   * Consulta a BD los Banners de la instancia
   * Servicio: Servicio Storage
   * SP: SP_CRUD_BANNERS
   * Tabla: tbl_banners
   * @param IdInstancia Identificador de la Instancia
   */
  public async ConsultaBannersxInstancia(IdInstancia: number): Promise<any> {
    let url = this.servicioWebPms.pathStorage + '/Storage/ConsultarBanners?IdInstancia=' + IdInstancia;
    return await this.servicioWebPms.postAsync(url, {});
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   * Convierte un arreglo de Banners a JSON y los guarda en Local Storage
   * @param bn arreglo de Banners
   */
  public async SetBanners(bn: modelBanners[]) {
    let BannersM: modelBanners[] = [];
    BannersM = bn;
    await localStorage.setItem('banners', JSON.stringify(BannersM));
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async CompareBanners(bncompare: modelBanners[]) {

    let localBanner: modelBanners[] = [];
    localBanner = JSON.parse(localStorage.getItem('banners'));
    if (localBanner.length > 0) {
      localStorage.removeItem('banners');
      localStorage.setItem('banners', JSON.stringify(bncompare));
    } else {
      localStorage.setItem('banners', JSON.stringify(bncompare));
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   *Regresa el arreglo de Banners del Local Storage
   * */
  public async getBannersLocal() {
    return await JSON.parse(localStorage.getItem('banners'));
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   *Elimina el arreglo de Banners del Local Storage
   * */
  public async removeBannersLocal() {
    localStorage.removeItem('banners');
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   *  Inicio del proceso para cargar banners
   *Recive como parámetro la instancia a buscar  
    */
  public async ProcesosBanner(IdInstancia: number) {


    let bannerBD: modelBanners[] = [];
    bannerBD = await this.ConsultaBannersxInstancia(IdInstancia);
    let bannerLocal = await this.getBannersLocal();
    if (bannerLocal != null) {
      if (bannerLocal.length == 0) {
        //existe banner pero no tiene elementos localmente
        await this.removeBannersLocal();
        for (let bbd of bannerBD) {
          let data = await this.ObtenerDatosArchivo(bbd);
          bbd.tipo = data.tipo;
          bbd.base64 = data.base64;
        }
        await this.SetBanners(bannerBD);//agregar banners de bd a local storage

      } else {
        //hay banners en local storage
        await this.ValidarExisteBannerLocal(bannerBD);
      }
    } else {//no hay banner local
      for (let bbd of bannerBD) {
        //bbd.base64 = await this.ObtenerBase64Banner(bbd);
        let data = await this.ObtenerDatosArchivo(bbd);
        bbd.tipo = data.tipo;
        bbd.base64 = data.base64;
      }
      await this.SetBanners(bannerBD);//agregar banners de bd a local storage
    }
    return this.getBannersLocal();

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   * Empiezan las validaciones para revisar los archivos e ids
   * @param bn lista de banners del servicio Storage
   */
  public async ValidarExisteBannerLocal(bnBD: modelBanners[]) {
    if (bnBD.length > 0) {
      let bannerLocal = await this.getBannersLocal();
      for (let bbd of bnBD) {
        let Uuid = bannerLocal.find(x => x.uuid == bbd.uuid && x.nombre == bbd.nombre);
        if (Uuid == undefined) {
          bannerLocal.push(bbd);
        }
      }
      for (let bnlocal of bannerLocal) {
        let Uuid = bnBD.find(x => x.uuid == bnlocal.uuid && x.nombre == bnlocal.nombre);
        if (Uuid == undefined) {
          let ix = bannerLocal.findIndex(x => x.uuid == bnlocal.uuid && x.nombre == bnlocal.nombre);
          bannerLocal.splice(ix, 1);
        }
      }
      for (let local of bannerLocal) {
        if (local.base64 == null) {
          let data = await this.ObtenerDatosArchivo(local);
          local.tipo = data.tipo;
          local.base64 = data.base64;
        }
      }
      await this.removeBannersLocal();
      await this.SetBanners(bannerLocal);

    } else {
      await this.removeBannersLocal();
    }

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   * Recive el modelo de Banners y consulta en Google Cloud el archivo
   * en Base64 #nota debe incluir el nombre del archivo, los demas datos no importan
   * @param bnner modelo del Banner
   */
  public async ObtenerBase64Banner(bnner: modelBanners) {
    let doc;
    doc = await this.storageService.downloadFile(bnner.nombre);
    return doc[0].base64;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /**
   * Regresa los datos del archivo almacenado en Google Cloud
   * (Nombre, tipo de archivo, base 64, tamaño en bytes)
   * Necesita el nombre del archivo
   * @param bnner modelo del Banner
   */
  public async ObtenerDatosArchivo(bnner: modelBanners) {
    let doc;
    doc = await this.storageService.downloadFile(bnner.nombre);
    return doc[0];
  }


}

