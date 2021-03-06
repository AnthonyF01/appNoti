import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// import { FCM, NotificationData } from '@ionic-native/fcm';

import { FcmProvider } from '../fcm/fcm';
import { UserProvider } from '../../providers/user/user';

import { Service } from '../../settings/Laravel';

// import { DeviceTokenProvider } from '../deviceToken/deviceToken';

@Injectable()
export class AuthProvider {

  isAuthenticated: boolean = false;
  tokenDevice: any;

  constructor(
    public fcmprovider: FcmProvider, 
    public http: HttpClient, 
    private userService: UserProvider,
    private storage: Storage, 
    /*private fcm: FCM,*/
    ) {
  }

  // AUTH

  async checkIsAuthenticated () 
  {
    let now = Date.now();
    let auth: any = await this.storage.get('auth')
    if (!!!auth)
      return false;
    if ( auth.expired_at <= now)
      return false;

    // enviar una solicitud post o get al servidor para verificar si el storage coincide 
    // con la tabla device del server (con el fin de cerrar la sesion en el dispositivo)

    return true;
  }

  // get accessToken
  login (user: any) 
  {

    // See: https://laravel.com/docs/master/passport#password-grant-tokens
    // Tokens de concesión de contraseña

    let request = {
      'grant_type': 'password',
      'client_id': Service.passport.client_id,
      'client_secret': Service.passport.client_secret,
      // 'username': user.email,
      'username': user.name,
      'password': user.password,
    }

    // la url deberia ser "/oauth/token" pero se personalizo el controlador 
    // no se usa el que passport tiene por defecto    
    return this.http.post(`${Service.url}/api/oauth/token`, request).toPromise();
  }

  // get refreshToken (accessToken refreshed)
  async refreshToken (){

    // Cuando expira el token de acceso (access_token) [ checkIsAuthenticated() retorna false ]
    // se puede generar un nuevo token para la autenticacion del usuario 
    // sin que este ingrese nuevamente sus credenciales

    // See: https://laravel.com/docs/master/passport#refreshing-tokens
    // Actualizando Tokens 

    // Puede dar errores en el caso de que [ checkIsAuthenticated() retorne false ] xq this.storage['auth'] 
    // haya sido eliminado usando [ removeCredentials() ]
    let auth: any = await this.storage.get('auth');

    let request = {
      'grant_type': 'refresh_token',
      'refresh_token': auth.refresh_token,
      'client_id': Service.passport.client_id,
      'client_secret': Service.passport.client_secret,
    }

    return this.http.post(`${Service.url}/api/oauth/token`, request).toPromise();

  }

  register (user: any) 
  {
    user.client_id = Service.passport.client_id;
    return this.http.post(`${Service.apiUrl}/register`, user).toPromise();
  }

  async update (user: any) 
  {
    let accessToken: any = await this.getAccessToken();
    let headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    });
    return this.http.post(`${Service.apiUrl}/update`, user, { headers }).toPromise();
    
    // user.client_id = Service.passport.client_id;
    // return this.http.post(`${Service.apiUrl}/update`, user).toPromise();
  }

  async reset (user: any) 
  {
    let accessToken: any = await this.getAccessToken();
    let headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    });
    return this.http.post(`${Service.apiUrl}/resetPassword`, user, { headers }).toPromise();
    
    // user.client_id = Service.passport.client_id;
    // return this.http.post(`${Service.apiUrl}/update`, user).toPromise();
  }

  removeCredentials () {
    this.storage.remove('auth');
  }

  storeCredentials (response: any) {

    // See: https://laravel.com/docs/master/passport#password-grant-tokens
    // Tokens de concesión de contraseña

    // ya no se usa el controlador por defecto de passport
    // se ha creado un nuevo controlador AccessTokenController en app/http/api/
    // devuelve los datos necesarios que se solicitaban antes "this.storage.set('auth', { ... })"

    let expired_at = (response.expires_in * 1000) + Date.now();

    this.storage.set('auth', {
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      expired_at
    })

    // console.log('auth: '+ this.storage.get('auth'));
  }

  async getAccessToken () 
  {
    let auth: any = await this.storage.get('auth');
    console.log("AccessToken: "+auth.access_token);
    return auth.access_token;
  }

  async logout(){
    this.tokenDevice = await this.getTokenDevice();
    let accessToken: any = await this.getAccessToken();
    console.log("accessToken: "+accessToken);
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    });
    let data = JSON.stringify({
      client_id: Service.passport.client_id,
      tokenDevice: this.tokenDevice,
    });
    return this.http.post(`${Service.apiUrl}/logout`, data, { headers }).toPromise();
      
  }

  storeAccessType (data: any) {
    this.storage.set('accessType', data);
  }

  async getAccessType () {
    // en algunas ocasiones "this.storage.get('accessType')" no existe porque el app.component 
    // no lo carga en el logueo xq el usuario no esta registrado.
    let accessType: any = await this.storage.get('accessType');

    if (typeof accessType !== 'undefined' && accessType !== null && (accessType)) {
      console.log("accessType: "+accessType);
      return accessType;
    }else{
      // de esta forma se retornan valores en promesas << return new Promise(... resolve() ...) >>
      return new Promise((resolve) => {
        this.userService.checkAccess()
          .then((response:any)=>{
            this.storeAccessType(response);
            console.log("accessType-n: "+response);
            resolve(response);
          })
          .catch(error => {
            console.log("accessType-error: "+error);
            resolve(0);
          });
      });
    }

  }

  removeAccessType () {
    this.storage.remove('accessType');
  }





  // ***********************************************************************************






  // DEVICE

  storeTokenDevice (data: any) {
    this.storage.set('deviceToken', data);
  }

  removeTokenDevice () {
    this.storage.remove('deviceToken');
  }

  async getTokenDevice () 
  {

    let token = await this.storage.get('deviceToken');
    if (typeof token !== 'undefined' && (token)) {
      console.log("AAA. fcm.getToken(): "+token);
      return token;
    }else{
      // de esta forma se retornan valores en promesas << return new Promise(... resolve() ...) >>
      return new Promise((resolve) => {
        this.fcmprovider.getTokenDevice()
          .then((token:any)=>{
            this.storeTokenDevice(token);
            console.log("BBB. fcm.getToken(): "+token);
            // return token;
            resolve(token);
          })
          .catch(error => {
            console.log("BBB. ERROR - fcm.getToken(): "+error);
            // return null;
            resolve(0);
          });
      });
    }

  }

  async registerDeviceToken (){
    let accessToken: any = await this.getAccessToken();
    let token: any = await this.getTokenDevice();
    // console.log("accessToken: "+accessToken);
    let headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    });
    let data = JSON.stringify({
        client_id: Service.passport.client_id,
        token: token,
    });
    return this.http.post(`${Service.apiUrl}/register/registerDeviceToken`, data, { headers }).toPromise();
  }

}
