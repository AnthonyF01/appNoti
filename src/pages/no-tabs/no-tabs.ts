import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { DenunciaProvider } from '../../providers/denuncia/denuncia';

import { DetailsPage } from '../details/details';

/**
 * Generated class for the NoTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-no-tabs',
  templateUrl: 'no-tabs.html',
})
export class NoTabsPage {

  loading: any;

  flag:any = false;
  flag1:any = false;
  flag2:any = false;
  flag3:any = false;

  param:any = false;

  total: any = 0;

  expedientes: Array<{expediente:string, calificacion:string}>;
  victimas: Array<{nombre:string, apellido:string, nro_doc:string}>;

  public search: string;

  items: Array<{title:string, price:string, img:string}>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private denunciaService: DenunciaProvider,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,) {

    this.items = [
      { title: 'Android', price: 'The most popular', img: 'assets/imgs/celular8.jpg' },
      { title: 'Android', price: 'The most popular', img: 'assets/imgs/celular8.jpg' },
      { title: 'Android', price: 'The most popular', img: 'assets/imgs/celular8.jpg' },
      { title: 'Android', price: 'The most popular', img: 'assets/imgs/celular8.jpg' },
      { title: 'Android', price: 'The most popular', img: 'assets/imgs/celular8.jpg' },
      { title: 'Android', price: 'The most popular', img: 'assets/imgs/celular8.jpg' },
    ];

    // this.loading = this.loadingCtrl.create({content: 'Please wait ...'});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoTabsPage');
  }
  
  // puede recibir como parametro el expediente o dni (agregado ultimamente)
  findExpedienteDNI (search:string) {
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    console.log('finding expediente o dni');
    this.denunciaService.findExpediente(search, this.param)
    .then((response: any) => {
      this.expedientes = [];
      this.victimas = [];
      console.log("total");
      this.total = (typeof response.denuncia !== 'undefined' && response.denuncia.length > 0) ? response.denuncia.length : ( (typeof response.victima !== 'undefined' && response.victima.length > 0) ? response.victima.length : 0 ) ;
      // victima
      if ( typeof response.victima !== 'undefined' && response.victima.length > 0) {
        console.log("victima"+response.victima[0].nro_doc);
        this.flag1 = true;
        for (let index = 0; index < response.victima.length; index++) {
          this.victimas.push({nombre: response.victima[index].nombre, apellido: response.victima[index].apellido, nro_doc: response.victima[index].nro_doc});        
        }
      }else {
        this.flag = false;
      }
      //expediente
      if ( typeof response.denuncia !== 'undefined' && response.denuncia.length > 0) {
        console.log("denuncia"+response.denuncia[0].expediente);
        for (let index = 0; index < response.denuncia.length; index++) {
          this.expedientes.push({expediente: response.denuncia[index].expediente,calificacion: response.denuncia[index].calificacion});        
        }
        this.flag = true;
      }else {
        this.flag = false;
      }

      console.log(this.expedientes);
      this.loading.dismiss();
      // let alert = this.alertCtrl.create({ title: 'Info', message: response.denuncia, buttons: ['Ok'] });
      // alert.present();
    })
    .catch(err => {
      this.loading.dismiss();
      let alert = this.alertCtrl.create({ title: 'Error', message: 'Error al buscar informacion de la denuncia', buttons: ['Ok'] });
      console.log("error: "+err);
      alert.present();
    });
  }

  showDetails(search:string) {
    this.navCtrl.push(DetailsPage,{
      item:search
    });
  }

  reset() {
    this.search = '';
  }

  showPwd() {
    console.log("show pwd");
  }

  onChange(selectedValue: any){
    if (selectedValue == 1) {
      this.param = true; // vct
    }else{
      this.param = false; // exp
    }
  }

}
