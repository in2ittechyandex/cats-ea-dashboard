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
    // return this.http.get('https://run.mocky.io/v3/f15b4479-02d4-4052-908a-2a800222c446').map(res => <any>res);
    return this.http.post(url,[]).map(res => <any>res);

  }
}
