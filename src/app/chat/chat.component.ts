import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {


  constructor(private cs: ChatService) {
    cs.messages.subscribe(msg=>{
      console.log(msg);
    });
   }
  
  
   private message = {
    author: "tutorialedge",
    message: "this is a test message"
  };

  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.cs.messages.next(this.message);
  }
  ngOnInit() {
  }

}
