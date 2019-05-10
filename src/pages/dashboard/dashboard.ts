import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { DenunciaProvider } from '../../providers/denuncia/denuncia';
import { NotificationProvider } from '../../providers/notification/notification';
import { AuthProvider } from '../../providers/auth/auth';

import { AuthPage } from '../authLoginR/auth';

import { MedidaPage } from '../medida/medida';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  lat: any;
  lng: any;
  acc: any;

  isenabledBtn: boolean = true;

  checkAccess: any = false;

  loading: any;

  denuncias: Array<{ expediente:string, oficio:string, fdenuncia:string, fformalizacion:string, faudiencia:string, fremision:string, medida_file:string, calificacion:string }>;

  @ViewChild(Nav) nav: Nav;
  pages: Array<{title:string, component:string, openTab?:any, icon:string}>;

  constructor(
    public navCtrl: NavController, 
    private notificationService: NotificationProvider,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private denunciaService: DenunciaProvider,
    private geolocation: Geolocation,
    private authService: AuthProvider,) {
      this.loading = this.loadingCtrl.create({content: 'Espere ...'});
      this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  // asincrono => request al servidor
  // se ejecuta cuando la pagina esta a punto de entrar y se convierte en la pagina activa
  ionViewWillEnter(){  
    // this.checkAccess();

    /*this.checkAccessType()
      .then( (response) => {
        this.checkAccess = response;
        this.getCurrentPosition();
        if (response) {
          console.log("Administrador logueado");
        }else {
          console.log("Victima logueada");
          this.denunciaService.detailsVictimaExp()
            .then( (response: any) => {
              this.denuncias = [];
              for (let index = 0; index < response.filtro.length; index++) {
                this.denuncias.push({expediente:response.filtro[index].expediente, oficio:response.filtro[index].oficio, fdenuncia:response.filtro[index].fdenuncia, fformalizacion:response.filtro[index].fformalizacion, faudiencia:response.filtro[index].faudiencia, fremision:response.filtro[index].fremision, medida_file:response.filtro[index].medida_file, calificacion:response.filtro[index].calificacion});        
              }
            })
            .catch(error => {
              // this.loading.dismiss();
              let alert = this.alertCtrl.create({ title: 'Error', message: 'Error al buscar informacion de la denuncia', buttons: ['Ok'] });
              console.log(error);
              alert.present();
            });
        }
        this.loading.dismiss();
      })
      .catch(error => {
        console.log(error);
      });*/


    this.loading.dismiss();    
    // no es necesario saber la ubicacion
    // this.getCurrentPosition();

  }

  async checkAccessType (){
    let access = await this.authService.getAccessType();
    return access;
  }

  getCurrentPosition(){
    let options = {
      enableHighAccuracy:true,
      timeout: 5000,
      maximumAge: 3000
    };
    this.geolocation.getCurrentPosition(options)
    .then(position => {
      console.log("get position");
      this.lat = Number((position.coords.latitude).toFixed(5));
      this.lng = Number((position.coords.longitude).toFixed(5));
      this.acc = Number((position.coords.accuracy).toFixed(0))+'m';
      console.log("lat: "+this.lat+" - lng: "+this.lng+" - acc: "+this.acc);
      // alert("lat: "+this.lat+" - lng: "+this.lng+" - acc: "+this.acc);
    })
    .catch(error=>{
      console.log(error);  
    })
  }

  send(lat:any, lng: any, acc: any){
    
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();

    if ( (typeof lat !== 'undefined' && (lat)) && (typeof lng !== 'undefined' && (lng)) && (typeof acc !== 'undefined' && (acc)) ) {
      this.isenabledBtn = false;
      console.log("Send alert message to controller");
      // this.getLocation();
  
      this.notificationService.sendNotificationInfo(lat, lng, acc)
      .then((response: any) => {
        this.isenabledBtn = true;
        this.loading.dismiss();
        // this.user = response;
        console.log(response.info);
        if (response.status == 'success') {
          let alert = this.alertCtrl.create({ title: 'Info', message: response.info, buttons: ['Ok'] });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({ title: 'Error', message: response.info, buttons: ['Ok'] });
          alert.present();
        }
      })
      .catch(err => {
        this.isenabledBtn = true;
        this.loading.dismiss();
        let alert = this.alertCtrl.create({ title: 'Error', message: 'Error al enviar la noticiación'+err, buttons: ['Ok'] });
        alert.present();
      });
    }else{
      this.loading.dismiss();
      let alert = this.alertCtrl.create({ title: 'Info', message: 'Las coordernadas de su ubicación no están definidas. Por favor recargue esta página.', buttons: ['Ok'] });
      alert.present();
    }

  }

  openPage (page){
    console.log("Pagina abierta.");
    this.navCtrl.push(page);
  }

  logout () {
    this.authService.logout()
    .then((response: any) => {
        if (response) {
          this.authService.removeCredentials(); // elimina datos del storage
          this.authService.removeTokenDevice(); // elimina datos del storage
          setTimeout(() => {
            // this.menuCtrl.enable(false);
            this.navCtrl.setRoot(AuthPage);
          }, 750);
        }
      })
      .catch(err => {
        console.log("Error on logout: "+err);
      });
  }

  showMedidas() {
    this.navCtrl.push(MedidaPage,{
      items:this.denuncias
    });
  }

}
