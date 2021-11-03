import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ChatService } from './../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userForm: FormGroup;
  user = this.api.getCurrentUser();
  posts = [];
  spin = false
  userv = {
    email: '',
  }

  constructor(
    private api: ApiService,
    private fb: FormBuilder,  
    private alertCtrl: AlertController,
    private router: Router,
    private chatserv:ChatService
  ) { }

  ngOnInit() {

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  login() {

    this.spin = true;

    this.chatserv.loginWithEmail({email:this.userForm.value.username,password:this.userForm.value.password}).then(res=>{
      console.log(res);
      localStorage.setItem('uid',res.user.uid)
      if(res.user.uid){
        this.api.prof(this.userv).subscribe(user => {
          console.log('after login: ', user)
          let role = user['role'];

          if (role == 'ADMIN') {
            this.router.navigateByUrl('/admin-chat')
          } else {
            this.router.navigateByUrl('/tabs/tab1/messages')
          }
        })
        this.spin = false;
        this.chatserv.getDetails({uid:res.user.uid}).subscribe(res=>{
          console.log(res);
        },err=>{
          console.log(err);
        });
      }
    },err=>{
      alert(err.message)
      console.log(err);
    })

/*     this.api.signIn(this.userForm.value.username, this.userForm.value.password).subscribe(
      userv => {
        console.log("logeado", userv)
        this.api.prof(this.userv).subscribe(user => {
          console.log('after login: ', user)
          let role = user['role'];

          if (role == 'ADMIN') {
            this.router.navigateByUrl('/admin-chat')
          } else {
            this.router.navigateByUrl('/tabs/tab1/messages')
          }
        })
        this.spin = false;
      },
      err => {
        this.showError(err);
        this.spin = false;
      }
    ); */
  }

  async showError(err) {
    const alert = await this.alertCtrl.create({
      header: err.error.code,
      message: err.error.message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
