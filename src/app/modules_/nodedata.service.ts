import { Injectable, EventEmitter } from '@angular/core'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators'; 
import { Node, Link } from './d3';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NodedataService {

  constructor(private http: HttpClient) { }

   
  getNodesData(hostList): Observable<any> {
    // host="GBEN01C7606X01A";
    var url="http://172.16.61.163:8000/neomodel/all_nodes/host";
    url=environment._AlarmURL + "actionengine/nia_response";
     
    var formData: FormData = new FormData();
    formData.append("node",JSON.stringify(hostList));
    return this.http.post(url,formData).pipe(
      map(this.extractData));
  }
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

 nodeSelected=new EventEmitter<Node>();
 linkSelected=new EventEmitter<Link>();

 

} 
