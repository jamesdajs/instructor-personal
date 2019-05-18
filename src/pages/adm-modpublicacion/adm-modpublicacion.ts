import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsuarioProvider} from "../../providers/usuario/usuario"
import { finalize } from 'rxjs/operators';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the AdmModpublicacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-adm-modpublicacion',
  templateUrl: 'adm-modpublicacion.html',
})
export class AdmModpublicacionPage {
  imagen64=""
  myForm:FormGroup
  datos={
    comentario:"",
    imagenes:[],
    titulo:"",
    costo:0,
    semanas:"",
    horas:"",
    coordenadas:{
      lat:'',
      lng:'',
      zoom:''
    },
    direccion:''
  }
  key=""
  dummyJson = {
    
    semanas:[
        { description: 'Semanas', value: '' }
      ],
      horas:[
        { description: 'Meses', value: '' }
      ]
    
  
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage:AngularFireStorage,
    public toastCtrl:ToastController,
    public camera:Camera,
    public formb:FormBuilder,
    public user:UsuarioProvider,
    public loadCtrl:LoadingController,
    public selector:WheelSelector,
    
    public geolocation:Geolocation

    ) {
      this.datos.comentario=navParams.data.comentario
      this.datos.imagenes=navParams.data.imagenes
      this.datos.titulo=navParams.data.titulo
      this.datos.costo=navParams.data.costo
      this.datos.semanas=navParams.data.semanas
      this.datos.horas=navParams.data.horas
      this.datos.coordenadas=navParams.data.coordenadas
      this.datos.direccion=navParams.data.direccion
      this.key=navParams.data.key
      this.myForm = this.formb.group({
        comentario: ['', [Validators.required,Validators.maxLength(300)]],

        costo:['', [Validators.required,Validators.maxLength(4)]],

        titulo:['', [Validators.required,Validators.maxLength(300)]]
      });
      for(let i=1;i<13;i++){
        this.dummyJson.horas.push({ description: i+'', value: ''+i })
        this.dummyJson.semanas.push({ description: i+'', value: ''+i })
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdmModpublicacionPage', this.datos);
    this.loadMap()
  }
  seleccionarImagen(){
    const options: CameraOptions = {
      quality:75,
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
  guardar(){
  if(this.myForm.invalid )
  {this.toastCtrl.create({
    message: 'Tiene que llenar todos los datos',
    duration: 3000}).present()

  }else
    this.user.cambiarEstadoPublicasion()
    .then(()=>{
      
        let load=this.loadCtrl.create({
            content: "Guardando datos...",
          })
          load.present()
        const toast = this.toastCtrl.create({
          message: 'Se modifico correctamente  la publicacion',
          duration: 3000})
        
        this.user.modPublicasion(this.key,this.datos)
        .then(res=>{
          //console.log(res)
          if(this.imagen64!="")
          this.uploadImgB64("publicaciones/"+this.key,this.imagen64)
            .then(url=>{
              console.log(url)
  
                load.dismiss()
                toast.present()
                this.navCtrl.pop()
              
            })
          else{
            load.dismiss()
                toast.present()
                this.navCtrl.pop()
          }
          
        }).catch(err=> {
          load.dismiss()
          alert(JSON.stringify(err))
        })
      
    })
    
    
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
  modificarset(){
  
    this.selector.show({
      title: "Duración del curso",
      
      displayKey: 'description',
      items: [
        this.dummyJson.semanas,
        this.dummyJson.horas
      ],
      
      positiveButtonText: "Aceptar",
      negativeButtonText: "Cancelar",
  
      wrapWheelText:true,
    }).then(
      result => {
        if(this.dummyJson.semanas[result[0].index].value!='' || 
          this.dummyJson.horas[result[1].index].value!=''){
            this.datos.semanas=this.dummyJson.semanas[result[0].index].value
            this.datos.horas=this.dummyJson.horas[result[1].index].value
          }else{
            this.toastCtrl.create({
              message:"Debe colocar un tiempo de duración",
              duration:3000
            }).present()
          }
         },
      err => console.log('Error: ' + JSON.stringify(err))
      )
  }

  async loadMap()  {
    // This code is necessary for browser
    let latlng={}
    console.log(this.datos)
    if(!this.datos.coordenadas){
      let resp= await this.geolocation.getCurrentPosition()
      latlng={lat:resp.coords.latitude, lng: resp.coords.longitude}
    }else{
      latlng={lat:this.datos.coordenadas.lat, lng: this.datos.coordenadas.lng}
    }
    let map
      map = new google.maps.Map(document.getElementById('map_publi'), {
        center: latlng,// this.datosins.nombregym+' '+this.datosins.ciudad+' '+this.datosins.departamento,
        zoom: this.datos.coordenadas?this.datos.coordenadas.zoom:12,
			  disableDefaultUI: true
      });
      var marker = new google.maps.Marker(
        {
          position:this.datos.coordenadas?latlng:'',
          map: map,
        }
        )
      let geocoder = new google.maps.Geocoder;
      let _datosins=this.datos
        map.addListener('click', function(event) {
          marker.setPosition(event.latLng)
          console.log(event)
          _datosins.coordenadas={
            lat:marker.getPosition().lat(),
            lng:marker.getPosition().lng(),
            zoom:map.getZoom()
          }
          geocoder.geocode({
            'location': event.latLng
          }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
      
                //alert('place id: ' + results[0].place_id);
                _datosins.direccion=results[0]['formatted_address'];
      
      
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          });
        });
	}
}
