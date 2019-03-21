import { Component } from '@angular/core';
import { IonicPage,
   NavController, 
   NavParams ,
   ModalController,
   ToastController,
   LoadingController} from 'ionic-angular';
import { AdmAsignardietaclientePage } from '../adm-asignardietacliente/adm-asignardietacliente'
import { UsuarioProvider } from "../../providers/usuario/usuario"

@IonicPage()
@Component({
  selector: 'page-adm-creardietacliente',
  templateUrl: 'adm-creardietacliente.html',
})
export class AdmCreardietaclientePage {
  fechaini= ''
  fechafin= ''
  ejercicios=[]
  public event = {
    nombre: "",
    descripcion:""
  }
  key
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private modal:ModalController,
     private user:UsuarioProvider,
     private toastCtrl:ToastController,
     private loadCtrl:LoadingController
     ) {
    this.key=this.navParams.data
  }

  ionViewDidLoad() {
    let date=new Date()
    this.fechaini=date.getFullYear()+"-"+(date.getMonth()<9?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<9?"0"+(date.getDate()):(date.getDate()))
    this.fechafin=this.fechaini
    //this.addEjercicio()
    console.log('ionViewDidLoad AdmCrearrutinaclientePage');
  }
  addEjercicio(){
    let profileModal = this.modal.create(AdmAsignardietaclientePage,{ejer:this.ejercicios},{enableBackdropDismiss:false});
   profileModal.onDidDismiss(data => {
     this.ejercicios=data.ejer
     console.log(data);
   });
   profileModal.present();
  }
  eliminar(i){
    this.ejercicios.splice(i,1)
  }
  guardar(){
    if(this.event.nombre=="" || this.event.descripcion=="" ){
      this.toastCtrl.create({
        message:"Tiene que llenar todos los campos ",
        duration:3000
      }).present()
    }else if(this.ejercicios.length==0)
      this.toastCtrl.create({
        message:"Tiene que asignar almenos una dieta",
        duration:3000
      }).present()
    else{
      
      this.navCtrl.pop()
      let load=this.loadCtrl.create({
        content: "Guardando datos",
        })
        load.present()
        const toast = this.toastCtrl.create({
          message: 'Se guardo la dieta correctamente',
          duration: 3000})
      this.event["fechaini"]=new Date(this.fechaini.replace(/-/g, '\/'))
      this.event["fechafin"]=new Date(this.fechafin.replace(/-/g, '\/'))
      this.user.guardarDietacliente(this.key,this.event)
      .then(res=>{
        console.log(res.id)
        let funciones=[]
        this.ejercicios.forEach(item=>{
          delete item.key
          delete item.deslarga
          delete item.estadoadd

          item["iddietacli"]=res.id
          funciones.push(this.user.guardarDietas_dieta(item))
        })
        Promise.all(funciones)
        .then(()=>{
          load.dismiss()
          toast.present()
        })
      })
      
      
    }
  }

}
