import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Storage } from '@ionic/Storage';
import { ChatService } from '../services/chat.service';

const JWT_KEY = 'myjwtstoragekey';
const TOKEN_KEY = 'user-access-token'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user = new BehaviorSubject(null);
  totalpost = null;
  pages: any;

  userv: Observable<any>
  private authState = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private plt: Platform,
    private router: Router,
    private chatserv: ChatService
    ) {

    this.userv = this.authState.asObservable().pipe(
      filter(response => response)
    )
    this.authState.value
    this.loadUser();

    this.plt.ready().then(() => {
      this.storage.get(JWT_KEY).then(data => {
        if (data) {
          this.user.next(data);
        }
      })
    })
  }

  loadUser() {

    this.storage.get(TOKEN_KEY).then(data => {
      console.log('Loaded user: ', data)
      if (data) {
        this.authState.next(data)
      } else {
        this.authState.next({ email: null, role: null });
      }
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

  prof(credential): Observable<any> {
    let email = credential.email
    let userv = null;

    if (email === 'winwithsports') {
      userv = { email, role: 'ADMIN' }
    }else if(email === 'support@win-sport.egasystems.com'){
      userv = { email, role: 'ADMIN' }
    }
    else if(email === 'support@winwithsports.com'){
      userv = { email, role: 'ADMIN' }
    }
     else {
      userv = { email, role: 'USER' }
    }
    this.authState.next(userv);
    this.storage.set(TOKEN_KEY, userv)
    return of(userv)
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

  async logout() {

    await this.storage.set(TOKEN_KEY, null)
    this.authState.next(null)
    this.storage.remove(JWT_KEY).then(() => {
      this.user.next(null);
    });
    this.chatserv.signout();
    this.router.navigateByUrl('/');    
  }

  getPosts(page = 1) {
    let options = {
      observe: "response" as 'body',
      params: {
        per_page: '5',
        page: '' + page
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

  getPostContent(id) {
    return this.http.get(`${environment.apiUrl}/wp/v2/posts/${id}?_embed`).pipe(
      map(post => {
        if (post['_embedded']['wp:featuredmedia']) {
          post['media_url'] = post['_embedded']['wp:featuredmedia'][0]['media_details'].sizes['medium'].source_url;
        }
        return post;
      })

    )
  }




}