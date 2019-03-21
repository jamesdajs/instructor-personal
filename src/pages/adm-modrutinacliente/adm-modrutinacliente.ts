import { Component } from '@angular/core';
import { IonicPage,
   NavController, 
   NavParams ,
   ModalController,
   ToastController,
   LoadingController} from 'ionic-angular';
import { AdmAñadirejercicioPage } from '../adm-añadirejercicio/adm-añadirejercicio'
import { UsuarioProvider } from "../../providers/usuario/usuario"


@IonicPage()
@Component({
  selector: 'page-adm-modrutinacliente',
  templateUrl: 'adm-modrutinacliente.html',
})
export class AdmModrutinaclientePage {

  fechaini= ''
  fechafin= ''
  fechainiaux= ''
  fechafinaux= ''
  ejercicios=[]
  ejer_eliminados=[]
  indices=[]
  public event = {
    nombre: "",
    descripcion:"",
    fechaini:null,
    fechafin:null,
    fechainiS:null,
    fechafinS:null,
    key:"",
    dias:[]
  }
  
  key
  dias=[
    {value:'0',nombre:"Domingo",estado:false},
    {value:'1',nombre:"Lunes",estado:false},
    {value:'2',nombre:"Martes",estado:false},
    {value:'3',nombre:"Miercoles",estado:false},
    {value:'4',nombre:"Jueves",estado:false},
    {value:'5',nombre:"Viernes",estado:false},
    {value:'6',nombre:"Sabado",estado:false}
  ]
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private modal:ModalController,
     private user:UsuarioProvider,
     private toastCtrl:ToastController,
     private loadCtrl:LoadingController
     ) {
       console.log(navParams.data)
       this.event=navParams.data.rut
       if(navParams.data.rut.dias!== undefined)this.indices=navParams.data.rut.dias
       this.user.listarRutina_ejercicio(this.event.key)
       .subscribe(ejercicios=>{
         for(let i in ejercicios){
           ejercicios[i].idejer_rut=ejercicios[i].key
           ejercicios[i].key=ejercicios[i].idejercicio
         }
        this.ejercicios=ejercicios
        //console.log(this.ejercicios)
       })
    if(Object.keys(navParams.data).length==0)
      this.key=true
    else
      this.key=this.navParams.data.key
  }

  ionViewDidLoad() {
    let date=this.event.fechaini.toDate()
    this.fechaini=date.getFullYear()+"-"+(date.getMonth()<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<9?"0"+(date.getDate()):(date.getDate()))
    
    date=this.event.fechafin.toDate()
    this.fechafin=date.getFullYear()+"-"+(date.getMonth()<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<9?"0"+(date.getDate()):(date.getDate()))
    console.log(this.event.key,this.indices)
    //this.addEjercicio()
    console.log('ionViewDidLoad AdmCrearrutinaclientePage');
  }
  verdia(o,e){
    this.dias[o].estado=e.checked
  }
  addEjercicio(){
    let profileModal = this.modal.create(AdmAñadirejercicioPage,{ejer:this.ejercicios,elim:this.ejer_eliminados},{enableBackdropDismiss:false});
   profileModal.onDidDismiss(data => {
     this.ejercicios=data.ejer
     this.ejer_eliminados=this.ejer_eliminados.concat(data.elim)
     console.log(data);
   });
   profileModal.present();
  }
  eliminar(i){
    if(this.ejercicios[i].idejer_rut) this.ejer_eliminados.push(this.ejercicios[i].idejer_rut)
    this.ejercicios.splice(i,1)
    console.log(this.ejer_eliminados)
    
  }
  guardar(){
    if(this.event.nombre=="" || this.event.descripcion=="" ){
      this.toastCtrl.create({
        message:"Tiene que llenar todos los campos ",
        duration:3000
      }).present()
    }
    else if(this.ejercicios.length==0){
      this.toastCtrl.create({
        message:"Tiene que agregar al menos un ejercicio",
        duration:3000
      }).present()
    }else if(this.indices.length==0){
      this.toastCtrl.create({
        message:"Tiene que agregar los dias que realizara la rutina",
        duration:3000
      }).present()
    }
      
    else{
      
      this.navCtrl.pop()
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
        this.fechafinaux=this.event.fechafin
        this.fechainiaux=this.event.fechaini
        this.event["fechaini"]=new Date(this.fechaini.replace(/-/g, '\/'))
        this.event["fechafin"]=new Date(this.fechafin.replace(/-/g, '\/'))
        this.user.modrutinacliente(this.key,this.event.key,this.event)
        .then(()=>{
          console.log(this.event.key)
          this.guardarejercicios(this.event.key,load,toast)
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
        item["idrutina"]=res
        item["estado"]=false
        console.log(item)
        if(!item.idejer_rut)
          funciones.push(this.user.guardarRutina_ejercicio(item))
        
      })
      this.ejer_eliminados.forEach(item=>{
        
        funciones.push(this.user.eliminarRutina_ejercicio(item))
      })
      Promise.all(funciones)
      .then(()=>{
        
        this.event["fechaini"]=this.fechainiaux
        this.event["fechafin"]=this.fechafinaux
        //console.log(this.event)
        load.dismiss()
        toast.present()
      })
    
  }

}
