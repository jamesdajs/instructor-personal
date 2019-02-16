import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController,AlertController,ToastController } from 'ionic-angular';
import { DetallejercicioPage } from '../detallejercicio/detallejercicio';
import { AdmCrearrutinaclientePage } from '../adm-crearrutinacliente/adm-crearrutinacliente';

import { RutinaProvider } from '../../providers/rutina/rutina';
import { UsuarioProvider } from '../../providers/usuario/usuario';

import { Storage } from '@ionic/storage';
/**
 * Generated class for the AdmRutinasclientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adm-rutinascliente',
  templateUrl: 'adm-rutinascliente.html',
})
export class AdmRutinasclientePage {
key
items=[]
ejers={}
defecto=[]
  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    public rutina:RutinaProvider,
    public loadCtr:LoadingController,
    public store:Storage,
    public alertCtrl:AlertController,
    public toast:ToastController,
    public user : UsuarioProvider
    ) {
      this.key=navParams.data
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad RutinasPage');
    this.listarutinas()
    this.listarrutinasdef()
    console.log(this.ejers)
  }
  listarrutinasdef(){
    this.rutina.verRutinasDefecto()
    .subscribe(data=>{
      this.defecto=data
    })
  }
  habilitarrutina(key,e){
    console.log("hola" ,e)
    this.user.modrutinacliente(this.key,key,{estado:!e})
    .then(()=>{
      console.log("se modifico")
    })
  }
  alercontime(item){
    let alert = this.alertCtrl.create({
      title: 'Asignar fechas',
      message:"tiene q asignar fecha de inicio y fecha fin de la rutina",
      inputs: [
        {
          name: 'fecha',
          type:"date",
          min:"2019"
        },
        {
          name: 'fecha2',
          type:"date",
          min:"2019"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            console.log(data,item)
            if(data.fecha!="" &&  data.fecha2!=""){
              
              item.fechaini=new Date(data.fecha.replace(/-/g, '\/'))
              item.fechafin=new Date(data.fecha2.replace(/-/g, '\/'))
              this.rutina.asignar_rutina_defecto(this.key,item,item.key)
              .then(()=>{
                this.toast.create({
                  message:"se asignno la turina correctamnete",
                  duration:3000
                }).present()
              })
            }else{
              this.toast.create({
                message:"Tiene que llenar las dos fechas",
                duration:3000
              }).present()
            }
            
          }
        }
      ]
    });
    alert.present();
  }
  crear(){
    this.navCtrl.push(AdmCrearrutinaclientePage,this.key)
  }
  listarutinas(){
  
      this.rutina.verRutinasinstodos(this.key)
      .subscribe(list=>{
        list.forEach(element => {
          element.fechaini=this.convertirfecha(element.fechaini)
          element.fechafin=this.convertirfecha(element.fechafin)
          this.ejers[element.key]=[]
        });
        this.items=list
        console.log(list,this.key)
      })
  }
  convertirfecha(timestamp){
    let fecha=timestamp.toDate()
    return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()
  }
  verejercicios(key){
    //this.navCtrl.push(EjerciciosPage,key)
    if(this.ejers[key].length==0){
      this.rutina.verEjercicios(key)
      .subscribe(list=>{
        this.ejers[key]=list
        console.log(list)
      })
    }else{
      this.ejers[key]=[]
    }
    
  }
  verDetEjercicio(item){
      this.navCtrl.push(DetallejercicioPage,item)
  }

}

