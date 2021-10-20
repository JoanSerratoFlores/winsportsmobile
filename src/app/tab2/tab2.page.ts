import { LoadingController } from '@ionic/angular';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  posts = [];
  user = this.api.getCurrentUser();
  page = 1;
  count = null;

  constructor(
    private api: ApiService,private loadingCtrl:LoadingController
    ) { }
    
    ngOnInit() {
      this.user.subscribe(user => {
        if (user) {
          this.loadPrivatePosts();
        } 
        else {
          this.posts = [];
        }
      });
    }
  
  async loadPrivatePosts() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Data...'
    });
    await loading.present();
    this.api.getPosts().subscribe(res => {
      this.posts = res;
      loading.dismiss();
    });
  }

  loadMore(event) {
    this.page++;
 
    this.api.getPosts(this.page).subscribe(res => {
      this.posts = [...this.posts, ...res];
      event.target.complete();
 
      // Disable infinite loading when maximum reached
      if (this.page == this.api.pages) {
        event.target.disabled = true;
      }
    });
  }

}
