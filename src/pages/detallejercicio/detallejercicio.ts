import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RutinaProvider } from '../../providers/rutina/rutina';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AdmModejercicioPage } from '../adm-modejercicio/adm-modejercicio';

import { Storage } from '@ionic/storage';
/**
 * Generated class for the DetallejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detallejercicio',
  templateUrl: 'detallejercicio.html',
})
export class DetallejercicioPage {
  setejercicio=[]
  itemcompleto
  item={
    nombre:"",
    deslarga:"",
    linkyoutube:"",
    imagen1:"",
    imagen:'',
    tipo:""
  }
  
  alumno=false
  imagenaux=true
  setrealizado=false
  constructor(public navCtrl: NavController, public navParams: NavParams,public rutina:RutinaProvider,
    public storage:Storage,public user:UsuarioProvider
    ) {
    this.itemcompleto=this.navParams.data
    for(let i in this.navParams.data.peso){
      
      this.setejercicio.push({
        peso:this.navParams.data.peso[i],
        repeticiones:this.navParams.data.repeticiones[i],
        tiempo:this.navParams.data.tiempo[i],
        estado:false
      })
    }
    this.storage.get("rol")
    .then(rol=>{
      if(rol=="alumno"){
        this.alumno=true
        this.rutina.versetdeHoy(this.itemcompleto.idejercicio,this.itemcompleto.idrutina)
        .subscribe(sethoy=>{
          if(sethoy.length!=0) this.setrealizado=true
          console.log(sethoy)
        })
      }
      
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallejercicioPage' ,this.itemcompleto);
    console.log(this.setejercicio ,this.itemcompleto);
    this.verdetalle()
    setInterval(() => {this.cambiarImagen()},1000);
    
  }
  editar(item){
    this.navCtrl.push(AdmModejercicioPage,item)
  }
  cambiarImagen(){
    //console.log(this.imagenaux)
    if(this.item.imagen1!='' && this.item.imagen1)
      this.imagenaux=!this.imagenaux
    else{
      this.imagenaux=true
    }
  }
  verdetalle(){
    if(this.itemcompleto.idejercicio){
      this.rutina.verDetalleEjercicios(this.itemcompleto.idejercicio)
      .subscribe(data=>{
        //console.log(data,this.itemcompleto)
        this.item=data
      })
    }else{

      this.item=this.itemcompleto
    }
    
  }
  guardarset(){
    let peso=[],repeticiones=[],tiempo=[]
    for(let i in this.setejercicio){
      if(this.setejercicio[i].estado){
        peso.push(this.setejercicio[i].peso)
        repeticiones.push(this.setejercicio[i].repeticiones)
        tiempo.push(this.setejercicio[i].tiempo)
      }
    }
  this.itemcompleto.peso=peso
  this.itemcompleto.repeticiones=repeticiones
  this.itemcompleto.tiempo=tiempo
  this.user.modificarRutina_ejercicio(this.itemcompleto.key,{estado:true})
  .then(()=>{
    delete this.itemcompleto.key
    let f = new Date();
    let fecha=(f.getMonth() +1)+ "/" + f.getDate() + "/" + f.getFullYear()
    console.log(fecha)
    this.itemcompleto.fecha=new Date(fecha)
    this.rutina.crearsetsdeEjercicio(this.itemcompleto)
    .then(res=>{
      console.log(res)
      this.navCtrl.pop()
    })
  })
    
  }
  marcarset(e,o){
    console.log(e)
    this.setejercicio[o].estado=e.checked
  }
}
