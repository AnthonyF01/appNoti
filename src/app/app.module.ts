import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { Geolocation } from '@ionic-native/geolocation'; // necesario
import { GoogleMaps, Geocoder } from '@ionic-native/google-maps'; // necesario
import { NativeGeocoder } from '@ionic-native/native-geocoder'; // necesario
import { Toast } from '@ionic-native/toast'; // opcional
import { AndroidPermissions } from '@ionic-native/android-permissions'; // necesario
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/authLoginR/auth';
import { DashboardPage } from '../pages/dashboard/dashboard';
// import { PrimeroPage } from '../pages/primero/primero';

import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { NotificationProvider } from '../providers/notification/notification';
import { DenunciaProvider } from '../providers/denuncia/denuncia';
// import { DeviceTokenProvider } from '../providers/deviceToken/deviceToken';
import { NetworkProvider } from '../providers/network/network';
import { FcmProvider } from '../providers/fcm/fcm';

import { FCM } from '@ionic-native/fcm';

// pages push
import { DetailsPage } from '../pages/details/details';
import { PrimeroPage } from '../pages/primero/primero';
import { MedidaPage } from '../pages/medida/medida';
import { DetailmedidaPage } from '../pages/detailmedida/detailmedida';

// import { File } from '@ionic-native/file';
// import { FileTransfer, FileTransferObject  } from '@ionic-native/file-transfer';
// import { DocumentViewer } from '@ionic-native/document-viewer';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';

/*
* Ejecutar: 
* - ionic cordova plugin add com.telerik.plugins.nativepagetransitions
* - npm install --save @ionic-native/native-page-transitions
*/

import { NativePageTransitions } from '@ionic-native/native-page-transitions';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DashboardPage,
    AuthPage,
    DetailsPage,
    PrimeroPage,
    MedidaPage,
    DetailmedidaPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage,
    AuthPage,
    DetailsPage,
    PrimeroPage,
    MedidaPage,
    DetailmedidaPage,
  ],
  providers: [
    File,
    FileOpener,
    FileTransfer,
    DocumentViewer,
    Geolocation,
    GoogleMaps,
    Geocoder,
    NativeGeocoder,
    Toast,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    NativePageTransitions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UserProvider,
    NotificationProvider,
    DenunciaProvider,
    // DeviceTokenProvider,
    NetworkProvider,
    Network,
    FcmProvider,
    HomePage,
    DashboardPage,
    FCM,
  ]
})
export class AppModule {}
