import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { RutinaProvider } from '../../providers/rutina/rutina';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AdmModejercicioPage } from '../adm-modejercicio/adm-modejercicio';

import { Storage } from '@ionic/storage';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
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
  youtubeaux:SafeResourceUrl
  alumno=false
  imagenaux=true
  setrealizado=false
  constructor(public navCtrl: NavController, public navParams: NavParams,public rutina:RutinaProvider,
    public storage:Storage,public user:UsuarioProvider,
    private toastCtrl:ToastController,
    public sanitizer:DomSanitizer
    ) {
    this.itemcompleto=this.navParams.data
    if(this.itemcompleto.linkyoutube!="" && this.itemcompleto.linkyoutube)
    this.youtubeaux=sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+/[^/]+$/.exec(this.itemcompleto.linkyoutube)[0])
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
    console.log('ionViewDidLoad DetallejercicioPage' ,this.youtubeaux);
    this.verdetalle()
    
    
  }
  editar(item){
    this.navCtrl.push(AdmModejercicioPage,item)
  }
  
  verdetalle(){
    if(this.itemcompleto.idejercicio){
      this.rutina.verDetalleEjercicios(this.itemcompleto.idejercicio)
      .subscribe(data=>{
        //console.log(data,this.itemcompleto)
        //this.youtubeaux=/[^/]+$/.exec(data.linkyoutube)[0]
        //console.log(this.youtubeaux,data.linkyoutube)
        this.item=data
      })
    }else{

      this.item=this.itemcompleto
    }
    
  }
  guardarset(){
    let encontrado = this.setejercicio.find(function(element) {
      return element.estado == true;
    });
    console.log(encontrado)
    if(encontrado){
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
    }else if(this.setrealizado){
      this.toastCtrl.create({
        message:"El ejercicio ya se realizo el dia de hoy",
        duration:3000
      }).present()
    }else{
      this.toastCtrl.create({
        message:"Tienen que realizar al menos un set",
        duration:3000
      }).present()
    }
    
    
  }
  marcarset(e,o){
    console.log(e)
    this.setejercicio[o].estado=e.checked
  }
}
