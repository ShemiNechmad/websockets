import { Injectable } from '@angular/core';
import { WebsocketService } from "../websocket.service";
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';



const CHAT_URL = "ws://localhost:3000";

export interface Message {
  author: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).map(
      (response: MessageEvent): any => {
        let data = (response.data);
        return {data}
      }
    );
  }
}
