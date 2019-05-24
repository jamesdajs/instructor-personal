import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AdmDatosclientePage } from '../adm-datoscliente/adm-datoscliente';

/**
 * Generated class for the AdmAlumnosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-alumnos',
  templateUrl: 'adm-alumnos.html',
})
export class AdmAlumnosPage {
  solicitudes=[]
  datosbuscado=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user:UsuarioProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmAlumnosPage');
    this.cargardatos()
  }
  cargardatos(){
    this.user.verMissolicitud(false,"cliente")
    .subscribe(soli=>{
      this.solicitudes=soli
      console.log(soli)
    })
    this.user.verMissolicitud(true,"cliente")
    .subscribe(soli=>{
      this.datosbuscado=soli
      console.log(soli)
    })
  }
  verCliente(keycli){
    this.navCtrl.push(AdmDatosclientePage,keycli)
  }

}
