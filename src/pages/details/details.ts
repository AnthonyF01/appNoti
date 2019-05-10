import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

import { DenunciaProvider } from '../../providers/denuncia/denuncia';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  value: string;
  loading: any;

  oficio:any;
  expediente:any;
  institucion:any;
  instancia:any;
  fdenuncia:any;
  fformalizacion:any;
  calificacion:any;
  faudiencia:any;
  remitido:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private denunciaService: DenunciaProvider,
    public alertCtrl: AlertController,
    public transfer: FileTransfer,
    public file: File,
    private ft: FileTransfer, 
    private fileOpener: FileOpener, 
    private document: DocumentViewer,
  ) {
    this.value = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPagess');
    this.showDetails(this.value);
  }

  showDetails (search:string) {
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    console.log('finding expediente');
    this.denunciaService.detailsExpediente(search)
    .then((response: any) => {
      this.oficio = (response.denuncia.oficio) ? response.denuncia.oficio : '-';
      this.expediente = (response.denuncia.expediente) ? response.denuncia.expediente : '-';
      this.institucion = (response.denuncia.institucion) ? response.denuncia.institucion : '-';
      this.instancia = (response.denuncia.instancia) ? response.denuncia.instancia : '-';
      this.fdenuncia = (response.denuncia.fdenuncia) ? response.denuncia.fdenuncia : '-';
      this.fformalizacion = (response.denuncia.fformalizacion) ? response.denuncia.fformalizacion : '-';
      this.calificacion = (response.denuncia.calificacion) ? response.denuncia.calificacion : '-';
      this.faudiencia = (response.denuncia.faudiencia) ? response.denuncia.faudiencia : '-';
      this.remitido = (response.denuncia.remitido) ? response.denuncia.remitido : '-';
      console.log("response: "+response);
      this.loading.dismiss();
    })
    .catch(err => {
      this.loading.dismiss();
      let alert = this.alertCtrl.create({ title: 'Error', message: 'Error al buscar información de la denuncia', buttons: ['Ok'] });
      console.log("error: "+err);
      alert.present();
    });
  }

  downloadPDF() {
    let downloadUrl = 'https://devdactic.com/html/5-simple-hacks-LBT.pdf';
    let path = this.file.dataDirectory;
    const transfer = this.ft.create();

    transfer.download(downloadUrl, path + '5-simple-hacks-LBT.pdf').then(entry => {
      console.log('download complete: ' + entry.toURL());

      let url = entry.toURL();

      // if (this.platform.is('ios')) {
      //   this.document.viewDocument(url, 'application/pdf', {});
      // } else {
        this.fileOpener.open(url, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      // }
    }, (error) => {
      console.log('download ERROR: ' + error);
    });

    /*const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'https://devdactic.com/html/5-simple-hacks-LBT.pdf';
    console.log(url);
    fileTransfer.download(url, this.file.dataDirectory + '5-simple-hacks-LBT.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      console.log('download ERROR: ' + error);
    });*/

  }

}
