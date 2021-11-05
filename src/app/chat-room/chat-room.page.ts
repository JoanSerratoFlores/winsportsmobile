import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  name;
  o_uid;
  uid;
  chats = [];
  textMsg;

  constructor() {

    this.name = sessionStorage.getItem("name");
    this.o_uid = sessionStorage.getItem("uid");
    this.uid = localStorage.getItem("uid");

    firebase.firestore().collection("chats").doc(this.uid).collection(this.o_uid).orderBy("time").onSnapshot(snap => {
      this.chats = [];
      snap.forEach(child => {
        this.chats.push(child.data());
      });
    });

  }

  ngOnInit() {
  }

  send() {

    firebase.firestore().collection('chats').doc(this.uid).collection(this.o_uid).add({
      time: Date.now(),
      uid: this.uid,
      msg: this.textMsg
    });

    firebase.firestore().collection('chats').doc(this.o_uid).collection(this.uid).add({
      time: Date.now(),
      uid: this.uid,
      msg: this.textMsg
    }).then(() => {
      this.textMsg = ""
    });

  }


}
