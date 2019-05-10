import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Service } from '../../settings/Laravel';

import { File } from '@ionic-native/File';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';

/**
 * Generated class for the DetailmedidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-detailmedida',
  templateUrl: 'detailmedida.html',
})
export class DetailmedidaPage {

  value: any;
  loading: any;
  url: any;

  oficio:any;
  expediente:any;
  institucion:any;
  instancia:any;
  fdenuncia:any;
  fformalizacion:any;
  calificacion:any;
  faudiencia:any;
  remitido:any;
  medida:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private platform: Platform, 
    private file: File, 
    private ft: FileTransfer, 
    private fileOpener: FileOpener, 
    private document: DocumentViewer,
  ) {
    this.value = navParams.get('item');
    this.url = Service.url+'/img/denuncia/'+this.value.medida_file;
    // alert(this.url);
    console.log(this.url);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailmedidaPage');
    this.downloadPDF();
    this.showDetails(this.value);
  }

  showDetails (search:string) {
    console.log('showDetails');
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    this.oficio = this.value.oficio;
    this.expediente = this.value.expediente;
    // this.institucion = this.value.institucion;
    // this.instancia = this.value.instancia;
    this.fdenuncia = this.value.fdenuncia;
    this.fformalizacion = this.value.fformalizacion;
    this.calificacion = this.value.calificacion;
    this.faudiencia = this.value.faudiencia;
    this.medida = this.value.medida_file;
    // this.remitido = this.value.remitido;
    this.loading.dismiss();
  }

  downloadPDF() {
    console.log("downloadUrl");
    // let downloadUrl = 'https://devdactic.com/html/5-simple-hacks-LBT.pdf';
    // console.log('error');
    /*let path = this.file.dataDirectory;
    const transfer = this.ft.create();
    console.log('File is downloaded');

    transfer.download(downloadUrl, path + 'myfile.pdf').then(entry => {
      let url = entry.toURL();
   
      // if (this.platform.is('ios')) {
      //   this.document.viewDocument(url, 'application/pdf', {});
      // } else {
        this.fileOpener.open(url, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      // }
    });*/
  }

}
