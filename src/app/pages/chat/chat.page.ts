import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Message, MessageObj, User } from 'src/app/models/models';
import { ChatService } from 'src/app/service/chat.service';
import { DataService } from 'src/app/service/data.service';
import { COLLECTION } from 'src/app/utils/const';
import Methods from 'src/app/utils/helper/funtions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  reciever!: User;

  @ViewChild(IonContent) content: IonContent;
  messagesArray: Message[] = [];
  messageObject: MessageObj;
  newMsg = "";

  chatsDocumentId: string = "";
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private chatService: ChatService,
    private auth: Auth,
    private dataService: DataService  ) { }
  
  
  ngOnInit() {
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    this.dataService.setNewMessage(false);
    this.route.params.subscribe((params:any) => {
      this.reciever = JSON.parse(params.user);
      this.chatService.documentExists(COLLECTION.CHATS, this.reciever.uid);
      this.chatService.documentExist$.subscribe(status => {
        this.chatsDocumentId = status;
        this.chatService.getOurMessages(status).then(msgs => {
            msgs.forEach(m => {
              if(m && m.messages) {
                this.messagesArray = m.messages;
                console.log(m.messages);
                this.dataService.setChats(m.messages);
                this.content.scrollToBottom();      
              }
            })
        })
      });
   }); 
  }

  sendMessage() {
    const newMessage:Message = {
      msg: this.newMsg,
      from: this.auth.currentUser.uid,
      to: this.reciever.uid,
      createdAt: new Date().getMilliseconds//this.chatService.getServerTimestamp()
    } 
    console.log(newMessage);
    const newMessages: MessageObj = {
      messages: [
        ...this.messagesArray,
        newMessage
      ]
    } 
    this.chatService.addChatMessage(this.chatsDocumentId, newMessages, this.reciever.uid).then(() => {
      this.newMsg = "",
      this.content.scrollToBottom();      
    });
    
  }

  getSentDate(msg: any) {
    Methods.getSendDate(msg.createdAt);
    // return moment(new Date(msg.createdAt), "YYYYMMDD").fromNow();
  }
  

  fromMe(message: Message): boolean {
    return message.from === this.auth.currentUser.uid;
  }

  
 


}