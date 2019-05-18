import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { finalize } from 'rxjs/operators';
//import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RutinaProvider } from "../../providers/rutina/rutina"

import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { File } from "@ionic-native/file"
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
  datos = {
    nombre: "",
    descorta: "",
    deslarga: "",
    tipo: "",
    imagenes: [],
    linkyoutube: ""
  }
  imagen64 = ""
  imagen64_2 = ""
  uploadPercent
  downloadURL
  myForm: FormGroup
  imgCropUrl = []
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera,
    private storage: AngularFireStorage,
    private rutina: RutinaProvider,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private formb: FormBuilder,
    private imagePicker: ImagePicker,
    private file: File,
    private cropService: Crop

  ) {
    this.datos.tipo = navParams.data
    this.myForm = this.formb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      instrucciones: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmCrearejercicioPage');
  }
  borrarimg() {
    this.imagen64 = ''
  }
  borrarimg2() {
    this.imagen64_2 = ''
  }
  //para subir videos falta
	/*seleccionarfile(){
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
    
  }*/
  guardar() {

    if (this.myForm.invalid) {
      this.toastCtrl.create({
        message: 'Tiene que llenar todos los datos',
        duration: 3000
      }).present()
    } else {
      let load = this.loadCtrl.create({
        content: "Guardando datos...",
      })
      load.present()
      const toast = this.toastCtrl.create({
        message: 'Se creo correctamente el ejericicio',
        duration: 3000
      })

      this.rutina.crearEjercicio(this.datos)
        .then(res => {
          let funcImg = []
          for (let i in this.imgCropUrl) {
            funcImg.push(this.uploadImageToFirebase("ejercicios/" + res.id + "/", this.imgCropUrl[i]))
          }
          Promise.all(funcImg)
            .then(arrayurl => {
              //alert(arrayurl[0] +" "+arrayurl.length)
              let imagenes = []
              for (let i in arrayurl) {
                imagenes.push({ url: arrayurl[i], nombre: this.imgCropUrl[i].nombre })
              }

              this.rutina.modificarEjercicio(res.id, { imagenes: imagenes })
                .then(() => {
                  load.dismiss()
                  toast.present()
                  this.navCtrl.pop()

                })
            })

        })
    }
  }
  //sibir foto
  seleccionarImagen() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300,

    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = base64Image;
    }, (err) => {
      // Handle error
    });

  }
  seleccionarImagen2() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300,

    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imagen64_2 = base64Image;
    }, (err) => {
      // Handle error
    });

  }
  uploadImgB64(path: string, imageB64): Promise<any> {
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref(path)
      let task = ref.putString(imageB64, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(data => {
            console.log(data);
            resolve(data)
          })
        })
      )
        .subscribe()
    });
  }

  openImagePickerCrop() {
    this.imagePicker.hasReadPermission()
      .then((result) => {
        if (result == false) {
          // no callbacks required as this opens a popup which returns async    
          this.imagePicker.requestReadPermission();
        }
        else if (result == true) {
          this.imagePicker.getPictures({

            maximumImagesCount: 5,
            quality: 10
          })
            .then(async (results) => {
              this.imgCropUrl = []
              for (var i = 0; i < results.length; i++) {

                let imageData = await this.cropService.crop(results[i])
                let objres = await this.procesandoCrop(imageData)
                this.imgCropUrl.push(objres)
              }
            })

        }
      })
      .catch(err => {
        alert(JSON.stringify(err))
      })

  }
  procesandoCrop(imageData) {
    return new Promise((res, rej) => {
      this.file.resolveLocalFilesystemUrl(imageData)
        .then(newurlImage => {
          let dirpath = newurlImage.nativeURL
          let dirpathseg = dirpath.split("/")
          dirpathseg.pop()
          dirpath = dirpathseg.join('/')
          //alert(dirpath)
          this.file.readAsArrayBuffer(dirpath, newurlImage.name)
            .then(buffer => {
              //alert(buffer.byteLength)
              let blob = new Blob([buffer], { type: "image/jpg" })

              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                res({
                  base64: reader.result,
                  url: newurlImage.nativeURL,
                  nombre: newurlImage.name,
                  blob: blob
                })
              }
            })
        })
    })
  }
  uploadImageToFirebase(path, objres) {
    return new Promise((resolve, reject) => {
      //alert(newUrl)
      let ref = this.storage.ref(path + objres.nombre)
      let task = ref.put(objres.blob)
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(data => {
            //alert(data);
            resolve(data)
          })

        })
      )
        .subscribe()
    })
  }
}
