import { Component } from '@angular/core';
import { IonicPage,
   NavController, 
   NavParams ,
   ModalController,
   ToastController,
   LoadingController} from 'ionic-angular';
import { AdmAsignardietaclientePage } from '../adm-asignardietacliente/adm-asignardietacliente'
import { UsuarioProvider } from "../../providers/usuario/usuario"

/**
 * Generated class for the AdmModdietaclientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-moddietacliente',
  templateUrl: 'adm-moddietacliente.html',
})
export class AdmModdietaclientePage {
  fechaini= ''
  fechafin= ''
  fechainiaux= ''
  fechafinaux= ''
  ejercicios=[]
  ejer_eliminados=[]
 
  public event = {
    nombre: "",
    descripcion:"",
    fechaini:null,
    fechafin:null,
    fechainiS:null,
    fechafinS:null,
    key:""
  }
  key
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private modal:ModalController,
     private user:UsuarioProvider,
     private toastCtrl:ToastController,
     private loadCtrl:LoadingController
     ) {
    this.key=this.navParams.data.key
    this.event=this.navParams.data.dieta
    this.user.listardieta_dietas(this.event.key)
    .subscribe(ejercicios=>{
      for(let i in ejercicios){
        ejercicios[i].idejer_rut=ejercicios[i].key
        ejercicios[i].key=ejercicios[i].iddietas
      }
     this.ejercicios=ejercicios
     console.log(this.ejercicios)
    })
  }

  ionViewDidLoad() {
    let date=this.event.fechaini.toDate()
    this.fechaini=date.getFullYear()+"-"+(date.getMonth()<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<9?"0"+(date.getDate()):(date.getDate()))
    
    date=this.event.fechafin.toDate()
    this.fechafin=date.getFullYear()+"-"+(date.getMonth()<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<9?"0"+(date.getDate()):(date.getDate()))
    //this.addEjercicio()
    console.log('ionViewDidLoad AdmCrearrutinaclientePage' ,this.event.key,this.key);
  }
  addEjercicio(){
    let profileModal = this.modal.create(AdmAsignardietaclientePage,this.ejercicios,{enableBackdropDismiss:false});
   profileModal.onDidDismiss(data => {
     this.ejercicios=data
     console.log(data);
   });
   profileModal.present();
  }
  eliminar(i){
    if(this.ejercicios[i].idejer_rut) this.ejer_eliminados.push(this.ejercicios[i].idejer_rut)
    this.ejercicios.splice(i,1)
  }
  guardar(){
    
    if(this.ejercicios.length==0)
      this.toastCtrl.create({
        message:"Tiene que asignar almenos una dieta",
        duration:3000
      }).present()
    else{
      let load=this.loadCtrl.create({
        content: "Guardando datos",
        })
        load.present()
        const toast = this.toastCtrl.create({
          message: 'Se Modifico la dieta correctamente',
          duration: 3000})
          this.fechafinaux=this.event.fechafin
          this.fechainiaux=this.event.fechaini
        this.event["fechaini"]=new Date(this.fechaini.replace(/-/g, '\/'))
        this.event["fechafin"]=new Date(this.fechafin.replace(/-/g, '\/'))
        this.user.moddietacliente(this.key,this.event.key,this.event)
      .then(res=>{
        console.log(res)
        let funciones=[]
        this.ejercicios.forEach(item=>{
          
          if(!item.idejer_rut){
            delete item.key
            delete item.deslarga
            delete item.estadoadd
  
            item["iddietacli"]=this.event.key
            funciones.push(this.user.guardarDietas_dieta(item))
          }
        })
        this.ejer_eliminados.forEach(item=>{
        
          funciones.push(this.user.eliminarRutina_ejercicio(item))
        })
        Promise.all(funciones)
        .then(()=>{
          this.event["fechaini"]=this.fechainiaux
          this.event["fechafin"]=this.fechafinaux
          load.dismiss()
          toast.present()
          this.navCtrl.pop()
        })
      })
      
      
    }
  }

}
