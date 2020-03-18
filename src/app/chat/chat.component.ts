import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  public chattings: any = [];
  public users:any =[];
  public textInput: string = null;
  public name: string = null;
  public chatIsOpen: boolean = false;
  @ViewChild('chatBox') private chatBox: ElementRef


  constructor(private cs: ChatService) {
    cs.messages.subscribe(msg => {
      let obj = JSON.parse(msg.data);
      this.chattings.push({ name: obj.author, text: obj.message });
    });
  }


  private message = {
    author: "user",
    message: "message"
  };

  sendMsg() {
    //console.log("new message from client to websocket: ", this.message);
    this.cs.messages.next(this.message);
  }
  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) { };
  }

  changeTextInput(event: string) {
    this.textInput = event;
  }

  submitText() {
    if (this.textInput) {
      //this.chattings.push({name: 'user', text:this.textInput});
      this.message = { author: 'user', message: this.textInput };
      this.cs.messages.next(this.message);
      this.textInput = null;
    }
  }

  changeName(event: string) {
    this.name = event;
  }

  enterName() {
    this.name ?
      this.chatIsOpen = true : alert('To join the chat, enter your name');
  }

}
