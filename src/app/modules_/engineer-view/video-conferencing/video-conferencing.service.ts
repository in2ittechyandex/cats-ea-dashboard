import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoConferencingService {

  constructor(private http: HttpClient) { }

  public getAllEngineer() {
    const url = environment._WEBGATEWAY_BASIC_URL_ + 'user/kpi/get_user_list';
    // return this.http.get('https://run.mocky.io/v3/39a677c7-e89a-4c9a-9a7c-ab64274cb74b').map(res => <any>res);
    return this.http.post(url,[]).map(res => <any>res);

  }
}
