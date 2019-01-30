import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController  } from 'ionic-angular';
import { finalize } from 'rxjs/operators';
//import { Observable } from 'rxjs';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { RutinaProvider } from "../../providers/rutina/rutina"

import { AngularFireStorage } from '@angular/fire/storage';
import {File} from "@ionic-native/file"
//import { AngularFireStorage } from 'angularfire2/storage';
//import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions,CaptureVideoOptions } from '@ionic-native/media-capture';

/**
 * Generated class for the AdmCrearejercicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-adm-crearejercicio',
  templateUrl: 'adm-crearejercicio.html',
})
export class AdmCrearejercicioPage {
  datos={
    nombre:"",
    descorta:"",
    deslarga:"",
    tipo:"",
	imagen:"",
	linkyoutube:""
  }
  imagen64=""
  uploadPercent
  downloadURL
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera:Camera,
    private storage:AngularFireStorage,
    private rutina:RutinaProvider,
    private loadCtrl:LoadingController,
    private toastCtrl:ToastController,
    private file: File
    ) {
      this.datos.tipo=navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCrearejercicioPage');
  }
  //para subir videos falta
	seleccionarfile(){
		const options: CameraOptions = {
		quality:25,
		destinationType: this.camera.DestinationType.DATA_URL,
		sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
		mediaType: this.camera.MediaType.VIDEO

		}
     
    this.camera.getPicture(options).then((imageData) => {
      
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):

		this.toastCtrl.create({
			message: imageData,
			duration: 3000
		}).present()
		this.file.resolveLocalFilesystemUrl("file://"+imageData)
		.then(newUrl=>{
			let dirpath=newUrl.nativeURL
			let dirpathseg=dirpath.split("/")
			dirpathseg.pop()
			dirpath=dirpathseg.join('/')
			alert(dirpath)
			this.file.readAsArrayBuffer(dirpath,newUrl.name)
			.then(buffer=>{
				let blob=new Blob([buffer],{type:"video/*"})
				let ref=this.storage.ref("ejercicios/"+newUrl.name)
				 ref.put(blob).then(()=>{
					 alert("done")
				 })
				 .catch(err=>{
					 alert(JSON.stringify(err))
				 })
				
			
			})
	  })
	  .catch(err=>{
		  
		alert(JSON.stringify(err))
	  })

     })
    
  }
  guardar(){
    
    if(this.datos.nombre==""||this.datos.descorta==""||this.datos.deslarga==""||this.datos.tipo=="")
    {this.toastCtrl.create({
      message: 'tiene q llenar todos los datos',
      duration: 3000}).present()
    }else{
      let load=this.loadCtrl.create({
          content: "Guardando datos...",
        })
        load.present()
      const toast = this.toastCtrl.create({
        message: 'Se creo correctamente el ejericicio',
        duration: 3000})
      
      this.rutina.crearEjercicio(this.datos)
      .then(res=>{
        //console.log(res)
        if(this.imagen64){
          this.uploadImgB64("ejercicios/"+res.id,this.imagen64).then(url=>{
            console.log(url)
            this.rutina.añadirfotoEjercicio(res.id,{imagen:url})
            .then(()=>{
              load.dismiss()
              toast.present()
              this.navCtrl.pop()
            })
          })
        }else{
          load.dismiss()
          toast.present()
          this.navCtrl.pop()
        }
      })
    }
  }
  //sibir foto
  seleccionarImagen(){
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true,
      targetHeight:300,
      targetWidth:300,

    }
     
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.imagen64=base64Image;
    }, (err) => {
     // Handle error
    });
    
  }

  uploadImgB64(path:string,imageB64):Promise<any>{
    return new Promise((resolve, reject)=>{
      let ref=this.storage.ref(path)
      let task= ref.putString(imageB64,'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(data=>{
            console.log(data);
            resolve(data)
          })
        } )
    )
    .subscribe()
      });
  }
}
