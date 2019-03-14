import { Component } from '@angular/core';
import { IonicPage,
   NavController, 
   NavParams ,
   ModalController,
   ToastController,
   LoadingController} from 'ionic-angular';
import { AdmAñadirejercicioPage } from '../adm-añadirejercicio/adm-añadirejercicio'
import { UsuarioProvider } from "../../providers/usuario/usuario"

/**
 * Generated class for the AdmCrearrutinaclientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-crearrutinacliente',
  templateUrl: 'adm-crearrutinacliente.html',
})
export class AdmCrearrutinaclientePage {
  fechaini= ''
  fechafin= ''
  ejercicios=[]
  indices=[]
  public event = {
    nombre: "",
    descripcion:""
  }
  key
  dias=[
    {nombre:"Domingo",estado:false},
    {nombre:"Lunes",estado:false},
    {nombre:"Martes",estado:false},
    {nombre:"Miercoles",estado:false},
    {nombre:"Jueves",estado:false},
    {nombre:"Viernes",estado:false},
    {nombre:"Sabado",estado:false}
  ]
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private modal:ModalController,
     private user:UsuarioProvider,
     private toastCtrl:ToastController,
     private loadCtrl:LoadingController
     ) {
    if(Object.keys(navParams.data).length==0)
      this.key=true
    else
      this.key=this.navParams.data
  }

  ionViewDidLoad() {
    let date=new Date()
    this.fechaini=date.getFullYear()+"-"+(date.getMonth()<9?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<9?"0"+(date.getDate()):(date.getDate()))
    this.fechafin=this.fechaini
    this.addEjercicio()
    console.log('ionViewDidLoad AdmCrearrutinaclientePage');
  }
  verdia(o,e){
    this.dias[o].estado=e.checked
  }
  addEjercicio(){
    let profileModal = this.modal.create(AdmAñadirejercicioPage,this.ejercicios,{enableBackdropDismiss:false});
   profileModal.onDidDismiss(data => {
     this.ejercicios=data
     console.log(data);
   });
   profileModal.present();
  }
  eliminar(i){
    this.ejercicios.splice(i,1)
  }
  guardar(){
    
    if(this.ejercicios.length==0){
      this.toastCtrl.create({
        message:"Tiene que agregar al menos un ejercicio",
        duration:3000
      }).present()
    }
      
    else{
      let load=this.loadCtrl.create({
        content: "Guardando datos",
        })
        load.present()
        const toast = this.toastCtrl.create({
          message: 'Se guardo la rutina correctamente',
          duration: 3000})
          
          for(let j in this.dias){
            if(this.dias[j].estado==true)
            this.indices.push(parseInt(j))
          }
          this.event["dias"]=this.indices
      if(this.key!=true){
        this.event["fechaini"]=new Date(this.fechaini.replace(/-/g, '\/'))
        this.event["fechafin"]=new Date(this.fechafin.replace(/-/g, '\/'))
        
        this.user.guardarrutinacliente(this.key,this.event)
        .then(res=>{
          //console.log(res.id)
          this.guardarejercicios(res,load,toast)
        })
      }else{
        this.user.guardarrutinaDefecto(this.event)
        .then(res=>{
          this.guardarejercicios(res,load,toast)
        })
        .catch(err=>{
          load.dismiss()
          console.log(err)
        })
      }
      
    }
  }
  guardarejercicios(res,load,toast){
      //console.log(res.id)
      let funciones=[]
      this.ejercicios.forEach(item=>{
        delete item.key
        delete item.deslarga
        delete item.imagen1
        delete item.estadoadd
        delete item.event
        delete item.opts
        delete item.component
        item["idrutina"]=res.id
        item["estado"]=false
        console.log(item)
        funciones.push(this.user.guardarRutina_ejercicio(item))
      })
      Promise.all(funciones)
      .then(()=>{
        load.dismiss()
        toast.present()
        this.navCtrl.pop()
      })
    
  }
}
