import { LoadingController } from 'ionic-angular';
import { Chooser } from '@ionic-native/chooser';
import { CaptureVideoOptions, MediaCapture, MediaFile } from '@ionic-native/media-capture';
import { Base64 } from '@ionic-native/base64';
import { CatalogosService } from './catalogos.service';
import { modelEvidencia } from './../models/modelEvidencia';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { ActionSheetController } from 'ionic-angular';
import * as Constants from '../utilities/constants';
import { ServicioUtilidades } from './utilidades.service';

declare var window: any;

@Injectable()
export class MediaService {
    ListEvidencias: modelEvidencia[] = [];

    constructor(public camera: Camera,
        private file: File,
        public serviceCatalogos: CatalogosService,
        public actionSheetCtrl: ActionSheetController,
        public bs64: Base64,
        private servicioUtilidades: ServicioUtilidades,
        public mediaCapture: MediaCapture,
        public chooser: Chooser,
        public loadingCtrl: LoadingController) {

    }

    async openGalleryImg(listDocumentos): Promise<any> {
        let evidencia = new modelEvidencia();
        let loading = this.loadingCtrl.create({ content: Constants.mensajeEspera });
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: true,
            mediaType: this.camera.MediaType.PICTURE
        }
        let response: any = await new Promise(resolve => {
            this.camera.getPicture(options).then(async (fileUri) => {
                loading.present().then(async () => {
                    if (fileUri.startsWith("content://")) {
                        fileUri = await this.GetFileUri(fileUri);
                    }

                    let extension = fileUri.substr(fileUri.lastIndexOf('.') + 1);
                    evidencia.nombre = fileUri.substr(fileUri.lastIndexOf('/') + 1);
                    evidencia.tipo = 'image/' + extension;
                    evidencia.tamano = await this.GetFileSize(fileUri);;
                    evidencia.base64 = await this.ConvertBase64(fileUri);
                    evidencia.idAdjunto = listDocumentos.find(documento => extension == documento.descripcionDocumento).idDocumento;

                    resolve(evidencia);
                }).then(() => {
                    loading.dismiss();
                })
            }, (err) => {
                loading.dismiss();
            });
        });
        return response;

    }

    async openGalleryVid(listDocumentos): Promise<any> {
        let evidencia = new modelEvidencia();
        let loading = this.loadingCtrl.create({ content: Constants.mensajeEspera });
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: true,
            mediaType: this.camera.MediaType.VIDEO
        }

        let response: any = await new Promise(resolve => {
            this.camera.getPicture(options).then(async (fileUri) => {
                loading.present().then(async () => {
                    fileUri = fileUri.includes("file://") ? fileUri : "file://" + fileUri;
                    let filesize = await this.GetFileSize(fileUri);
                    if (filesize < Constants.maxSizeVideo) {
                        let extension = fileUri.substr(fileUri.lastIndexOf('.') + 1);
                        evidencia.nombre = fileUri.substr(fileUri.lastIndexOf('/') + 1);
                        evidencia.tipo = 'video/' + extension;
                        evidencia.tamano = filesize;
                        evidencia.base64 = await this.ConvertBase64(fileUri);
                        evidencia.idAdjunto = listDocumentos.find(documento => extension == documento.descripcionDocumento).idDocumento;

                        resolve(evidencia);
                    } else {
                        this.servicioUtilidades.alerta('Error', Constants.mensajeMaxVideo)
                    }
                }).then(() => {
                    loading.dismiss();
                })
            }, (err) => {
                loading.dismiss();
            });

        });

        return response;
    }

    async openCam(listDocumentos): Promise<any> {
        let evidencia = new modelEvidencia();
        let loading = this.loadingCtrl.create({ content: Constants.mensajeEspera });
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: 600,
            targetWidth: 900
        }
        let response: any = await new Promise(resolve => {
            this.camera.getPicture(options).then(async imageData => {
                loading.present().then(async () => {
                    let extension = imageData.substring(imageData.lastIndexOf('.') + 1);
                    evidencia.nombre = imageData.substring(imageData.lastIndexOf('/') + 1);
                    evidencia.tipo = 'image/' + extension;
                    evidencia.tamano = await this.GetFileSize(imageData);
                    evidencia.base64 = await this.ConvertBase64(imageData);
                    evidencia.idAdjunto = listDocumentos.find(documento => extension == documento.descripcionDocumento).idDocumento;

                    resolve(evidencia);
                }).then(() => {
                    loading.dismiss();
                })
            }).catch(error => {
                console.error(error);
                loading.dismiss();
            });
        });

        return response;

    }

    async openVideoCam(listDocumentos): Promise<any> {
        let evidencia = new modelEvidencia();
        let loading = this.loadingCtrl.create({ content: Constants.mensajeEspera });
        let options: CaptureVideoOptions = { limit: 1, duration: 10, quality: 1 };

        let response: any = await new Promise(resolve => {
            this.mediaCapture.captureVideo(options)
                .then(async (fileuri: MediaFile[]) => {
                    loading.present().then(async () => {
                        let fullpath = fileuri[0].fullPath;
                        fullpath = fullpath.includes("file://") ? fullpath : "file://" + fullpath;

                        let filesize = await this.GetFileSize(fullpath);
                        if (filesize < Constants.maxSizeVideo) {
                            var filename = fullpath.substr(fullpath.lastIndexOf('/') + 1);
                            var extension = filename.substr(filename.lastIndexOf('.') + 1);
                            evidencia.nombre = filename;
                            evidencia.tipo = 'video/' + extension;
                            evidencia.tamano = filesize;
                            evidencia.base64 = await this.ConvertBase64(fullpath);
                            evidencia.idAdjunto = listDocumentos.find(documento => extension == documento.descripcionDocumento).idDocumento;

                            resolve(evidencia);
                        } else {
                            this.servicioUtilidades.alerta('Error', Constants.mensajeMaxVideo)
                        }
                    }).then(() => {
                        loading.dismiss();
                    })
                }).catch(error => {
                    console.error(error);
                    loading.dismiss();
                });
        });
        return response;
    }

    async selectFile(listDocumentos): Promise<any> {
        let evidencia = new modelEvidencia();
        let loading = this.loadingCtrl.create({ content: Constants.mensajeEspera });
        let mime = 'application/pdf'

        let response: any = await new Promise(resolve => {
            this.chooser.getFile(mime)
                .then(async file => {
                    loading.present().then(async () => {
                        let padding = '='.repeat((4 - file.dataURI.length % 4) % 4);
                        let base64file = file.dataURI + padding;
                        let extension = file.name.substr(file.name.lastIndexOf('.') + 1);

                        evidencia.nombre = file.name;
                        evidencia.tipo = 'application/' + extension;
                        evidencia.tamano = await this.GetFileSize(file.uri);
                        evidencia.base64 = base64file;
                        evidencia.idAdjunto = listDocumentos.find(documento => extension == documento.descripcionDocumento).idDocumento;

                        resolve(evidencia);
                    }).then(() => {
                        loading.dismiss();
                    }).catch(() => {
                        loading.dismiss();
                    })
                }, (err) => {
                    loading.dismiss();
                });
        });

        return response;
    }

    private async ConvertBase64(path): Promise<any> {
        let filename = path.substring(path.lastIndexOf('/') + 1);
        path = path.substring(0, path.lastIndexOf('/') + 1);
        let response: any = await new Promise(resolve => {
            this.file.readAsDataURL(path, filename).then(base64file => {
                resolve(base64file);
            });
        });
        return response;
    }

    private async GetFileUri(fileUri): Promise<string> {
        let response: any = await new Promise(resolve => {
            window.FilePath.resolveNativePath(fileUri, function (localFileUri) {
                resolve(localFileUri);
            });
        });
        return response;
    }

    private async GetFileSize(fileUri): Promise<any> {
        let response: any = await new Promise(resolve => {
            window.resolveLocalFileSystemURL(fileUri, FE => {
                FE.file(async file => {
                    resolve(file.size)
                })
            })
        });
        return response;
    }

}