import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { ChatService } from './chat.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {


  public chattings: any = [];
  public users: any = [];
  public textInput: string = null;
  public name: string = null;
  public chatIsOpen: boolean = false;
  private sub: Subscription = null;
  private message = { author: "user", message: "message"};
  @ViewChild('chatBox') private chatBox: ElementRef


  constructor(private cs: ChatService, private router: Router) {
    this.sub = cs.messages.subscribe(msg => {
      let obj = JSON.parse(msg.data);
      if (obj.user) this.users.push({ name: obj.user });
      if (obj.author) { this.chattings.push({ name: obj.author, text: obj.message }); }
      if (obj.userOffline) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].name === obj.userOffline) {
            this.users.splice(i, 1);
          }

        }
      }
    });
    this.sub.add (this.cs.getUsers().subscribe(data=>{
      let d = JSON.parse(data);
      if (d.users) {
        for (let i=0; i<d.users.length; i++){
          this.users.push({name:d.users[i].user});
        }
      }
    }, error => {console.log(error)}));
  }

  @HostListener('window:beforeunload')
  doSomething() {
    if (this.chatIsOpen) this.cs.users.next({ userOffline: this.name });
  }
  @HostListener('window:refresh')
  refresh() {
    if (this.chatIsOpen) this.cs.users.next({ userOffline: this.name });
  }

  sendMsg() {
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
      this.message = { author: this.name, message: this.textInput };
      this.cs.messages.next(this.message);
      this.textInput = null;
    }
  }

  changeName(event: string) {
    this.name = event;
  }

  enterName() {
    if (this.name) {
      this.chatIsOpen = true;
      this.cs.users.next({ user: this.name });
    }
  }
}
