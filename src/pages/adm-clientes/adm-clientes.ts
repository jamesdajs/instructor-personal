import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { UsuarioProvider } from "../../providers/usuario/usuario"
import { DatosinstructorPage } from '../../pages/datosinstructor/datosinstructor'

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
  publicaciones=[]
  num=3
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private user:UsuarioProvider,
     public toastCtrl: ToastController
     ) {
      this.lstarPublicaciones()
      

  }
  altodelIMG
  ionViewDidLoad() {
   //alert("La resolución de tu pantalla es: " + screen.width + " x " + screen.height)
    this.altodelIMG=screen.width
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
      delete item.key
      this.user.guardarRutina_cliente(item)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  verCliente(keycli){
    this.navCtrl.push(AdmDatosclientePage,keycli)
  }
  lstarPublicaciones(infiniteScroll?){
    let mes=["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic."]
    let hoy=new Date()
    this.user.listarPublicasion(this.num)
    .subscribe(res=>{
      res.forEach(element => {
        let prefi=""
        let diap=element.fecha.toDate()
        if(diap.getDate()==hoy.getDate() && 
        diap.getMonth()==hoy.getMonth() &&
        diap.getFullYear()==hoy.getFullYear()
        )
          prefi="Hoy "
        else if(diap.getDate()+1==hoy.getDate() && 
        diap.getMonth()==hoy.getMonth() &&
        diap.getFullYear()==hoy.getFullYear())
          prefi="Ayer "
        else prefi=diap.getDate()+" de "+mes[diap.getMonth()]

        element["fecha2"]=prefi+" "+ diap.getHours()+":"+(diap.getMinutes()<9?"0"+diap.getMinutes():diap.getMinutes())
      });
      let aNuevo = res.slice(res.length-3)
      		this.publicaciones=this.publicaciones.concat(aNuevo)
      console.log(res)
      if(infiniteScroll)infiniteScroll.complete()
    })
  }
  estadoToast=true;
  alerta(){
    const toast = this.toastCtrl.create({
      message: 'En esta sección encontrarás a todos tus alumnos. Selecciona un alumno para poder adicionar rutinas y dietas',
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    });
    
    if(this.estadoToast){
      toast.present()
      this.estadoToast=false
    } 
    toast.onDidDismiss(() => {
      this.estadoToast=true
    });
  }



  verInstructor(key){
    this.navCtrl.push(DatosinstructorPage,key)
  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.num=this.num+3
      this.lstarPublicaciones(infiniteScroll)
    }, 500);
  }
}
