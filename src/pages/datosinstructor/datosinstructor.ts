import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController} from 'ionic-angular';
import { UsuarioProvider } from  "../../providers/usuario/usuario"

/**
 * Generated class for the DatosinstructorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-datosinstructor',
  templateUrl: 'datosinstructor.html',
})
export class DatosinstructorPage {
  datos={
    email: "",
    nombres: "",
    apellidos: "",
    foto:"",
    peso:null,
    altura:0,
    telefono:0,
    genero:null,
    fechanac:null,
    
  }
  datosins={
    deslarga:"",
    cursos:"",
    descorta:""
  }
  edad=""
  key
  estadobut=true
  estado=true
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public user:UsuarioProvider,
     private loadCtrl:LoadingController,
     private toastCtrl:ToastController
     ) {
       this.key=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatosinstructorPage');
    this.cargaDeDatos()
  }
  solicitud(){
    let load=this.loadCtrl.create({
      content: "Enviando solicitud...",
    })
    load.present()
    let instructor_cliete={
      fullname:this.datos.nombres+" "+this.datos.apellidos,
      foto:this.datos.foto,
      descorta:this.datosins.descorta,
      estado:false,
      idinstructor:this.key,
      rol:"cliente"
    }
    this.user.veriduser()
    .then(idcli=>{
      instructor_cliete["idcliente"]=idcli
      this.user.leermisdatosPromesa()
      .then(datos=>{
        instructor_cliete["fullnamecli"]=datos.nombres+" "+datos.apellidos
        instructor_cliete["fotocli"]=datos.foto
        this.user.guardarSolicitud(instructor_cliete)
        .then(()=>{
          load.dismiss()
          this.toastCtrl.create({
            message: 'Solicitud enviada correctamente',
            duration: 3000}).present()
        })
        console.log(datos)
      })
    })
    
  }
  cargaDeDatos(){
    this.user.versihaysolicitud(this.key)
    .subscribe(datos=>{
      if(datos.length!=0) {
        this.estadobut=false
        if(datos[0].estado==true)
          this.estado=false
      }
      

    })
    //console.log(this.key)
      this.user.leerOtrosdatos(this.key)

      .subscribe( res =>{
        this.datos=res
        this.edad=this.convertirfecha(res.fechanac)
      })
      this.user.leerOtrosdatosinstructor(this.key)
      .subscribe(res=>{
        //console.log(res)
        this.datosins=res
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
}
