import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth
  ) { }

  loginWithEmail(data) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  signup(data) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  saveDetails(data) {
    return this.firestore.collection("users").doc(data.uid).set(data);
  }
  getDetails(data) {
    return this.firestore.collection("users").doc(data.uid).valueChanges();
  }

  signout(){
    firebase.auth().signOut().then(() => {
      localStorage.removeItem("uid")
      localStorage.removeItem("name")
      sessionStorage.removeItem("uid")
      sessionStorage.removeItem("name")
    })
  }

}
