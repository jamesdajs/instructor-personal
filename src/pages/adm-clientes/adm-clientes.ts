import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UsuarioProvider } from "../../providers/usuario/usuario"

import { AdmDatosclientePage } from "../adm-datoscliente/adm-datoscliente"
/**
 * Generated class for the AdmClientesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-clientes',
  templateUrl: 'adm-clientes.html',
})
export class AdmClientesPage {
  solicitudes=[]
  datosbuscado=[]
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private user:UsuarioProvider
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmClientesPage');
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
  aceptar(item){
    this.user.modificarinstructor_cliente(item.key,{estado:true})
    .then(()=>{
      item.estado=true
      item.rol="instructor"
      this.user.guardarRutina_cliente(item)
    })
    .catch(err=>{
      console.log(err)
    })
    
  }
  verCliente(keycli){
    this.navCtrl.push(AdmDatosclientePage,keycli)
  }
}
