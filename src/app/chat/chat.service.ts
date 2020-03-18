import { Injectable } from '@angular/core';
import { WebsocketService } from "../websocket.service";
import { Subject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';



const CHAT_URL = "ws://ec2-18-217-130-29.us-east-2.compute.amazonaws.com:3000";

export interface Message {author: string; message: string;}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: Subject<any>;
  public users:Subject<any>;

  constructor(wsService: WebsocketService, private http: HttpClient) {
    this.messages = <Subject<any>>wsService.connect(CHAT_URL).map(
      (response: MessageEvent): any => {
        let data = (response.data);
        return {data}
      }
    );
    this.users  = <Subject<any>>wsService.connect(CHAT_URL).map(
      (response: MessageEvent): any => {
        let data = (response.data);
        console.log(data);
        return {data}
    });
  }

  getUsers():Observable<any>{
    let headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'});
    let options = {headers:headers}
    return this.http.get('http://ec2-18-217-130-29.us-east-2.compute.amazonaws.com:8080/chat',{responseType:'text'});
  }
}
