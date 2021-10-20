import { getTestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { Storage } from '@ionic/Storage';
 
const JWT_KEY = 'myjwtstoragekey';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user = new BehaviorSubject(null);
  totalpost=null;
  pages:any;
 
  constructor(private http: HttpClient, private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.storage.get(JWT_KEY).then(data => {
        if (data) {
          this.user.next(data);
        }
      })
    })
  }
 
  signIn(username, password) {
    return this.http.post(`${environment.apiUrl}/jwt-auth/v1/token`, { username, password }).pipe(
      switchMap(data => {
        return from(this.storage.set(JWT_KEY, data));
      }),
      tap(data => {
        this.user.next(data);
      })
    );
  }
 
  signUp(username, email, password) {
    return this.http.post(`${environment.apiUrl}/wp/v2/users/register`, { username, email, password });
  }
 
  resetPassword(usernameOrEmail) {
    return this.http.post(`${environment.apiUrl}/wp/v2/users/lostpassword`, { user_login: usernameOrEmail });
  }
 
  getPrivatePosts() {
    return this.http.get<any[]>(`${environment.apiUrl}/wp/v2/posts?_embed`).pipe(
      map(data => {
        for (let post of data) {
          if (post['_embedded']['wp:featuredmedia']) {
            post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
          }
        }
        return data;
      })
    );
  }
 
  getCurrentUser() {
    return this.user.asObservable();
  }
 
  getUserValue() {
    return this.user.getValue();
  }
 
  logout() {
    this.storage.remove(JWT_KEY).then(() => {
      this.user.next(null);
    });
  }

  getPosts(page = 1){
    let options = {
      observe: "response" as 'body',
      params: {
        per_page: '5',
        page: ''+page
      }
    };
 
    return this.http.get<any[]>(`${environment.apiUrl}/wp/v2/posts?_embed`, options).pipe(
      map(resp => {
        this.pages = resp['headers'].get('x-wp-totalpages');
        this.totalpost = resp['headers'].get('x-wp-total');
 
        let data = resp['body'];
 
        for (let post of data) {
          if (post['_embedded']['wp:featuredmedia']) {
            post.media_url = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
          }        
        }
        return data;
      })
    )
  }

  getPostContent(id){
    return this.http.get(`${environment.apiUrl}/wp/v2/posts/${id}?_embed`).pipe(
      map(post=>{
        if (post['_embedded']['wp:featuredmedia']) {
        post['media_url']=post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
         }
        return post;
      })
    
    )
  }




}