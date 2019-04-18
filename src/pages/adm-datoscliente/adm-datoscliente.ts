import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AdmRutinasclientePage } from '../adm-rutinascliente/adm-rutinascliente'
import { AdmDietasclientePage } from '../adm-dietascliente/adm-dietascliente'
//import { Cliente } from '../../app/app.config'
/**
 * Generated class for the AdmDatosclientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-datoscliente',
  templateUrl: 'adm-datoscliente.html',
})
export class AdmDatosclientePage {
  datos={
    email: "",
    nombre: "",
    foto:"",
    peso:null,
    altura:0,
    telefono:0,
    genero:null,
    fechanac:null,
    
  }
  edad=""
  edad2=""
  key
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public user:UsuarioProvider,
    public toastCtrl: ToastController
    ) {
      this.key=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmDatosclientePage');
    this.cargardatos()
  }
  cargardatos(){
    this.user.datosCliente(this.key)
      .subscribe( res =>{
        this.datos=res
       
        this.edad=this.convertirfecha(res.fechanac)
        this.edad2=this.convertirfecha2(res.fechanac)
        //carga de imagenes
        /*let img = document.querySelector('img'); 
          img.onload = function() {

        }*/
        //console.log(this.datos)
      })
  }
  convertirfecha(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getDate()+"-"+(fecha.getMonth()<9?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+fecha.getFullYear()
    }else{
      return null
    }
  }
  convertirfecha2(timestamp){
    if(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getFullYear()+"-"+(fecha.getMonth()<9?"0"+(fecha.getMonth()+1):(fecha.getMonth()+1))+"-"+fecha.getDate()
    }else{
      return null
    }
  }
  Rutinas(){
    this.navCtrl.push(AdmRutinasclientePage,this.key)
  }
  Dietas(){
    this.navCtrl.push(AdmDietasclientePage,this.key)
  }
  alerta(){
    const toast = this.toastCtrl.create({
      message: 'Para asignar rutinas y dietas para '+this.datos.nombre +" primeramente debes crearlos en tu menu Rutinas y Hábitos alimenticios",
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }
}
