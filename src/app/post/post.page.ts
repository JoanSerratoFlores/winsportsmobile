import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  post: any;
 
  constructor(private route: ActivatedRoute, private api: ApiService,private loadingCtrl:LoadingController) { }
 
  async ngOnInit() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Data...'
    });
    await loading.present();
    let id = this.route.snapshot.paramMap.get('id');
    this.api.getPostContent(id).subscribe(res => {
      this.post = res;
      loading.dismiss();
    });
  }
 
  openOriginal() {
    // Add InAppBrowser for app if want
    window.open(this.post.link, '_blank');
  }
}
