import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  userForm: FormGroup;
  

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

    this.userForm = this.fb.group({
      usernameOrEmail: ['', Validators.required]
    });

  }
  resetPw() {
    this.api.resetPassword(this.userForm.value.usernameOrEmail).subscribe(
      async res => {
        const toast = await this.toastCtrl.create({
          message: res['message'],
          duration: 2000
        });
        toast.present();
      },
      err => {
        this.showError(err);
      }
    );
  }

  async showError(err) {
    const alert = await this.alertCtrl.create({
      header: err.error.code,
      subHeader: err.error.data.status,
      message: err.error.message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
