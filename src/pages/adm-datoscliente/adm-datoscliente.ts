import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,AlertController, Slides } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AdmRutinasclientePage } from '../adm-rutinascliente/adm-rutinascliente'
import { AdmDietasclientePage } from '../adm-dietascliente/adm-dietascliente'

import { DetallejercicioPage } from '../detallejercicio/detallejercicio';
import { AdmCrearrutinaclientePage } from '../adm-crearrutinacliente/adm-crearrutinacliente';
import { AdmModrutinaclientePage } from '../adm-modrutinacliente/adm-modrutinacliente';

import { DetalledietaPage } from '../detalledieta/detalledieta';
import { AdmCreardietaclientePage } from '../adm-creardietacliente/adm-creardietacliente';
import { AdmModdietaclientePage } from '../adm-moddietacliente/adm-moddietacliente';

import { DietasProvider } from '../../providers/dietas/dietas';
import { RutinaProvider } from '../../providers/rutina/rutina';

import { Storage } from '@ionic/storage';
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
  key
  items=[]
  ejers={}
  defecto=[]
  defestado=false

  items1=[]
  ejers1={}

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

  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public rutina:RutinaProvider,
    public loadCtr:LoadingController,
    public store:Storage,
    public alertCtrl:AlertController,
    public toastCtrl:ToastController,
    public user : UsuarioProvider,
    public dieta:DietasProvider
    ) {
      this.key=navParams.data,
      this.selectedSegment = 'first';
      this.slides = [
        {
          id: "first",
          title: "First Slide"
        },
        {
          id: "second",
          title: "Second Slide"
        },
        {
          id: "third",
          title: "Third Slide"
        }
      ];
  }

  //funciones tab slide
  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    console.log('Slide changed');
    const currentSlide = this.slides[slider.activeIndex];
    this.selectedSegment = currentSlide.id;
  }
  //end funciones tab slide

  //FUNCIONES PERFIL
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmDatosclientePage');
    this.cargardatos()
    console.log('ionViewDidLoad RutinasPage');
    this.listarutinas()
    this.listarrutinasdef()
    console.log(this.ejers)
    console.log('ionViewDidLoad RutinasPage');
    this.listadietas()
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

  estadoToast=true;
  alerta(){
    const toast = this.toastCtrl.create({
      message: 'Para asignar rutinas y dietas para '+this.datos.nombre +" primeramente debes crearlos en tu menu Rutinas y Hábitos alimenticios",
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
   //END FUNCIONES PERFIL

    //FUNCIONES DE RUTINAS
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
            min:"2019",
            placeholder:"Fecha de inicio"
          },
          {
            name: 'fecha2',
            type:"date",
            min:"2019",
            placeholder:"Fecha fin"
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
                  this.toastCtrl.create({
                    message:"se asignno la turina correctamnete",
                    duration:3000
                  }).present()
                })
              }else{
                this.toastCtrl.create({
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
            element.fechainiS=this.convertirfechaR(element.fechaini)
            element.fechafinS=this.convertirfechaR(element.fechafin)
            this.ejers[element.key]=[]
          });
          this.items=list
          console.log(list,this.key)
        })
    }
    convertirfechaR(timestamp){
      let fecha=timestamp.toDate()
      return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()
    }
    verejercicios(key){
      //this.navCtrl.push(EjerciciosPage,key)
      if(this.ejers[key].estado==false)
        for(let i in this.ejers){
          this.ejers[i].estado=false
        }
      if(this.ejers[key].length==0){
        this.rutina.verEjercicios(key)
        .subscribe(list=>{
          this.ejers[key]=list
          this.ejers[key].estado=true
          //console.log(list)
        })
      }else {
        this.ejers[key].estado=!this.ejers[key].estado
      }
      
    }
    verDetEjercicio(item){
        this.navCtrl.push(DetallejercicioPage,item)
    }
    editar(item){
      this.navCtrl.push(AdmModrutinaclientePage,{rut:item,key:this.key})
    }
    verrutinasdef(){
      console.log(this.defestado)
      this.defestado=!this.defestado
    }

    //END FUNCIONES RUTINAS 

    //FUNCIONES DIETAS
    habilitardieta(key,e){
      console.log("hola" ,e)
      this.user.modrDietacliente(this.key,key,{estado:!e})
      .then((res)=>{
        console.log("se modifico",this.key,key,{estado:!e})
      })
    }
  
    crearRutina(){
      this.navCtrl.push(AdmCreardietaclientePage,this.key)
    }
    listadietas(){
    
        this.dieta.verDietasinstodo(this.key)
        .subscribe(list=>{
          list.forEach(element => {
            element.fechainiS=this.convertirfecha(element.fechaini)
            element.fechafinS=this.convertirfecha(element.fechafin)
            this.ejers1[element.key]=[]
            element["estadohiide"]=false

          });
          this.items1=list
          console.log(list,this.key)
        })
    }
    verDietas(item){
      
    item["estadohiide"]=!item["estadohiide"]
      //this.navCtrl.push(EjerciciosPage,key)
      
      if(this.ejers1[item.key].length==0){
        this.dieta.verdietasasignadas(item.key)
        .subscribe(list=>{
          this.ejers1[item.key]=list
          console.log(list,item)
        })
      }
      
    }
    verDetDieta(item){
        this.navCtrl.push(DetalledietaPage,item)
    }
    editarDieta(item){
      this.navCtrl.push(AdmModdietaclientePage,{dieta:item,key:this.key})
    }
  

  }

 

