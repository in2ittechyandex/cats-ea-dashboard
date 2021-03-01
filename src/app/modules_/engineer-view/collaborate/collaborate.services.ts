
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';

import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/app/services_/user.services';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CollaborateService {



    constructor(private http: HttpClient, private userService: UserService
    ) { }


    public getDiscussions(episodeId) { 
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_discussions';
            const formData: FormData = new FormData();
            formData.append('situation_id', episodeId);
            return this.http.post(url, formData).map(res => <any>res);
        }
        public getInnerDiscussions(episodeId) { 
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/get_child_discussions_comment';
            const formData: FormData = new FormData();
            formData.append('comment_id', episodeId);
            return this.http.post(url, formData).map(res => <any>res);
        }

        public comment(episode_id,comment_text) { 
               const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/comment';
               const formData: FormData = new FormData();
               formData.append('episode_id', episode_id);
               formData.append('comment_text', comment_text);
               return this.http.post(url, formData).map(res => <any>res);
           }
           public editComment(comment_id,comment_text) { 
            const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/edit_discussion_comment';
            const formData: FormData = new FormData();
            formData.append('comment_id', comment_id);
            formData.append('text', comment_text);
            return this.http.post(url, formData).map(res => <any>res);
        }
           public commentReply(comment_id,reply_text) {  
               const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/comment_reply';
               const formData: FormData = new FormData();
               formData.append('comment_id', comment_id);
               formData.append('reply_text', reply_text);
               return this.http.post(url, formData).map(res => <any>res);
           }
           public commentAction(comment_id,action) {  
               const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/comment_action';
               const formData: FormData = new FormData();
               formData.append('comment_id', comment_id);
               formData.append('action', action);
               return this.http.post(url, formData).map(res => <any>res);
           }

            public commentDelete(comment_id) {  
               const url = environment._WEBGATEWAY_BASIC_URL_ + 'menu/kpi/delete_discussion_comment';
               const formData: FormData = new FormData();
               formData.append('comment_id', comment_id); 
               return this.http.post(url, formData).map(res => <any>res);
           }
}
