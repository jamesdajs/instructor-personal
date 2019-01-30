//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from 'rxjs/Observable';

import {AngularFireAuth} from '@angular/fire/auth';
import { map } from "rxjs/operators";
/*
  Generated class for the RutinaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DietasProvider {

  constructor(private db: AngularFirestore,
    private auth:AngularFireAuth
    ) {
    console.log('Hello RutinaProvider Provider');
  }
  //dietas adm
  crearDieta(data){
    data["idinstructor"]=this.auth.auth.currentUser.uid
    return this.db.collection("dietas").add(data)
  }//ejercicios
  añadirfotoDieta(id,data){
    return this.db.collection("dietas").doc(id).set(data,{ merge: true })
  }
  eliminarDieta(id){
    return this.db.collection("dietas").doc(id).delete()
  }
  modificarDieta(id,data){
    return this.db.collection("dietas").doc(id).set(data,{ merge: true })
  }
  
  verMisDietas(tipo){
    let query=res=>res.where("idinstructor","==",this.auth.auth.currentUser.uid).where("tipo","==",tipo)
    return this.getcollArrayconkey("dietas",query)
  }
  //hastaqui dietas adm
  private  getcollitem(coll,key):Observable<any>{
    return this.db.collection(coll).doc(key)
    .valueChanges()
  }
  
  verDietas(keyins){
    let query=res => res.where("estado", "==", false).where("idinstructor","==",keyins)
    return this.getcollArrayconkey("cliente/"+this.auth.auth.currentUser.uid+"/dietas",query)
  }
  verDietasins(keycli){
    let query=res => res.where("estado", "==", false).where("idinstructor","==",this.auth.auth.currentUser.uid)
    return this.getcollArrayconkey("cliente/"+keycli+"/dietas",query)
  }
  /*
  private getSubcollArrayconkey(coll,key,collChild,query?):Observable<any>{
    return this.db.collection(coll).doc(key).collection(collChild,query)
    .snapshotChanges().pipe(map(change=>{
      return change.map(c=>({key:c.payload.doc.id, ...c.payload.doc.data()}))
    }))
  }*/
  verDietasporTipo(tipo){
    let query=res => res.where("idinstructor","==",this.auth.auth.currentUser.uid)
                        .where("tipo","==",tipo)
    return this.getcollArrayconkey("dietas",query)
  }
  verSubdietas(iddietaP){
    let query=res => res.where("estado", "==", false).where("iddietas","==",iddietaP)
    return this.getcollArrayconkey("dietas_dieta",query)

  }
  modificardietasDietas_dietas(keydieta,data){
    return this.db.collection("dietas_dieta").doc(keydieta).set(data,{ merge: true })
  }
  listaDietas_dietas(keydieta){
    let query=res=>res.where("iddietas","==",keydieta)
    return this.getcollArrayconkey("dietas_dieta",query)
  }
  verDetalleDieta(keyejer){
    return this.getcollitem("dietas",keyejer)
  }
  
  private getcollArrayconkey(coll,query?):Observable<any>{
    return this.db.collection(coll,query)
    .snapshotChanges().pipe(map(change=>{
      return change.map(c=>({key:c.payload.doc.id, ...c.payload.doc.data()}))
    }))
  }
  verdietasasignadas(keydieta){
    let query=res=>res.where("iddietacli","==",keydieta)
    return this.getcollArrayconkey("dietas_dieta",query)
  }
  /*
  verEjercicios(keyrut){
    let query=res=>res.where("idrutina","==",keyrut)
    return this.getcollArrayconkey("rituna_ejer",query)
  }
  verDetalleDieta(keyejer){
    return this.getcollitem("ejercicios",keyejer)
  }
  
  */
 
}
